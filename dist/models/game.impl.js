import { PsnpEntity } from './common.js';
import { Select, diffAndUpdateSharedProps } from '../index.js';
// Type predicates
const percentKey = 'percent';
const trophyCountKey = 'trophyCount';
const stackLabelKey = 'stackLabel';
export function sumTrophyCount(tc) {
    return tc.bronze + tc.silver + tc.gold + tc.platinum;
}
export function calculateTrophyPoints(tc) {
    return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}
export function isGameFromStacks(game) {
    return !(percentKey in game) && !(trophyCountKey in game);
}
export function isGameFromHome(game) {
    return !(percentKey in game) && trophyCountKey in game;
}
export function isGameStandard(game) {
    return !(percentKey in game) && trophyCountKey in game && stackLabelKey in game;
}
export function isGamePlayable(game) {
    return percentKey in game;
}
export class PsnpGameBase extends PsnpEntity {
    platforms;
    trophyCount;
    get url() {
        return `https://psnprofiles.com/trophies/${this._id}-${this._nameSerialized}`;
    }
    get src() {
        return `https://i.psnprofiles.com/games/${this._imagePath}.png`;
    }
    /** (Getter) Calculates game's point value based on its trophy count. */
    get points() {
        return this.trophyCount ? calculateTrophyPoints(this.trophyCount) : Number.NaN;
    }
    constructor(data) {
        super(data);
        this.platforms = data.platforms;
    }
    /**
     * Parses game nodes from a given page. Server-side calls must explicitly pass a JSDOM document.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     * @returns
     */
    static getGameNodes(pageType, doc) {
        const selectors = Select.gameNodes[pageType] ?? '';
        const nodes = selectors.flatMap(selector => [...doc.querySelectorAll(selector)]);
        return nodes;
    }
}
export class PsnpGamePartial extends PsnpGameBase {
    stackLabel;
    constructor(data) {
        super(data);
        if (isGameFromHome(data)) {
            this.trophyCount = data.trophyCount;
        }
        if (isGameFromStacks(data)) {
            this.stackLabel = data.stackLabel;
        }
    }
}
export class PsnpGameStandard extends PsnpGameBase {
    trophyCount;
    stackLabel;
    numOwners;
    numTrophies;
    constructor(data) {
        super(data);
        this.trophyCount = data.trophyCount;
        this.stackLabel = data.stackLabel;
        this.numOwners = data.numOwners;
        this.numTrophies = data.numTrophies;
    }
}
export class PsnpGamePlayable extends PsnpGameBase {
    stackLabel;
    percent;
    completionStatus;
    completionSpeed;
    rarityBase;
    rarityDLC;
    latestTrophy;
    constructor(data) {
        super(data);
        this.stackLabel = data.stackLabel;
        this.percent = data.percent;
        this.completionStatus = data.completionStatus;
        this.completionSpeed = data.completionSpeed;
        this.rarityBase = data.rarityBase;
        this.rarityDLC = data.rarityDlc;
        this.latestTrophy = data.latestTrophy;
    }
    /** Converts seconds into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
     *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
    static secondsToSpeedString(seconds) {
        if (seconds === 0) {
            return '0 seconds';
        }
        const timeUnits = [
            { unit: 'year', value: 31536000 },
            { unit: 'month', value: 2626560 },
            { unit: 'week', value: 604800 },
            { unit: 'day', value: 86400 },
            { unit: 'hour', value: 3600 },
            { unit: 'minute', value: 60 },
            { unit: 'second', value: 1 },
        ];
        let speedString = '';
        let countUnits = 0;
        for (const { unit, value } of timeUnits) {
            if (seconds >= value) {
                const count = Math.floor(seconds / value);
                seconds -= value * count;
                speedString += `${count} ${unit}${count > 1 ? 's' : ''}`;
                countUnits++;
                if (countUnits === 2) {
                    break;
                }
                if (seconds > 0) {
                    speedString += ', ';
                }
            }
        }
        return speedString;
    }
    /** Parses a Fastest Achiever's speed as seconds. speedString is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
    static speedStringToSeconds(speedString) {
        const timeUnits = {
            sec: 1,
            min: 60,
            hou: 3600,
            day: 86400,
            wee: 604800,
            mon: 2626560,
            yea: 31536000,
        };
        const speeds = speedString.split(', ');
        let seconds = 0;
        for (const speed of speeds) {
            const [time, timeMetric] = speed.split(' ');
            const timeValue = parseInt(time, 10);
            const timeUnit = timeMetric.substring(0, 3);
            seconds += timeUnits[timeUnit] * timeValue;
        }
        return seconds;
    }
    /** Takes in a 'date played' element: \<div class="small-info" [...] */
    static timestampFromDatePlayed(element) {
        const textContent = element.textContent;
        if (!textContent) {
            return null;
        }
        const [dateText] = textContent.split('•').map(s => s.trim());
        if (!dateText) {
            throw new Error(`Unable to parse Date Played "${textContent}" into a timestamp`);
        }
        const cleanedDateText = dateText.replace(/(\d+)(st|nd|rd|th)/, '$1').trim();
        return new Date(cleanedDateText).valueOf();
    }
}
export class PsnpGameStandardDoc extends PsnpGameStandard {
    trophyGroups;
    rarityBase;
    rarityDlc;
    metaData;
    createdAt;
    updatedAt;
    get trophies() {
        if (!this.trophyGroups)
            return;
        return this.trophyGroups.flatMap(s => s.trophies);
    }
    constructor(data) {
        super(data);
        this.trophyGroups = data.trophyGroups;
        this.rarityBase = data.rarityBase;
        this.rarityDlc = data.rarityDlc;
        this.metaData = data.metaData;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    /** Updates fields and returns a log of changes. */
    static diffUpdate(oldGame, newGame, update) {
        const commonChanges = { id: newGame._id, changes: [] };
        if (!oldGame) {
            return { ...commonChanges, operation: 'add' };
        }
        if (oldGame._id !== newGame._id) {
            throw new Error(`ID mismatch: Cannot update game '${oldGame.toString()}' using game '${newGame.toString()}'`);
        }
        const changes = diffAndUpdateSharedProps(oldGame, newGame, update);
        return {
            ...commonChanges,
            operation: 'update',
            changes,
        };
    }
}
//# sourceMappingURL=game.impl.js.map