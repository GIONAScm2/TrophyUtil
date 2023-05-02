"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpGameStandardDoc = exports.PsnpGamePlayable = exports.PsnpGameStandard = exports.PsnpGamePartial = exports.PsnpGameBase = exports.isGamePlayable = exports.isGameStandard = exports.isGameFromHome = exports.isGameFromStacks = void 0;
const common_js_1 = require("./common.js");
const index_js_1 = require("../index.js");
// These variables protect type predicates by throwing errors if the property names ever change.
const percentKey = 'percent';
const trophyCountKey = 'trophyCount';
const stackLabelKey = 'stackLabel';
/** Type predicate to narrow `game` type as a {@link IGamePartialTrophyList} */
function isGameFromStacks(game) {
    return !(percentKey in game) && !(trophyCountKey in game);
}
exports.isGameFromStacks = isGameFromStacks;
/** Type predicate to narrow `game` type as a {@link IGamePartialHome} */
function isGameFromHome(game) {
    return !(percentKey in game) && trophyCountKey in game;
}
exports.isGameFromHome = isGameFromHome;
/** Type predicate to narrow `game` type as a {@link IGameStandard} */
function isGameStandard(game) {
    return !(percentKey in game) && trophyCountKey in game && stackLabelKey in game;
}
exports.isGameStandard = isGameStandard;
/** Type predicate to narrow `game` type as a {@link IGamePlayable} */
function isGamePlayable(game) {
    return percentKey in game;
}
exports.isGamePlayable = isGamePlayable;
/** Abstract class containing properties and methods applicable to all PSNP game types. */
class PsnpGameBase extends common_js_1.PsnpEntity {
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
        return this.trophyCount ? (0, common_js_1.calculateTrophyPoints)(this.trophyCount) : Number.NaN;
    }
    constructor(data) {
        super(data);
        this.platforms = data.platforms;
    }
    /**
     * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     */
    static getGameNodes(pageType, doc) {
        const selectors = index_js_1.Select.gameNodes[pageType] ?? '';
        const nodes = selectors.flatMap(selector => [...doc.querySelectorAll(selector)]);
        return nodes;
    }
}
exports.PsnpGameBase = PsnpGameBase;
/** Class representing a primitive PSNP game from `Home` or `Other Platforms and Regions` */
class PsnpGamePartial extends PsnpGameBase {
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
exports.PsnpGamePartial = PsnpGamePartial;
/** Class representing a standard PSNP game from `Games` or `GameSearch` */
class PsnpGameStandard extends PsnpGameBase {
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
exports.PsnpGameStandard = PsnpGameStandard;
class PsnpGamePlayable extends PsnpGameBase {
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
exports.PsnpGamePlayable = PsnpGamePlayable;
class PsnpGameStandardDoc extends PsnpGameStandard {
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
        const changes = (0, index_js_1.diffAndUpdateSharedProps)(oldGame, newGame, update);
        return {
            ...commonChanges,
            operation: 'update',
            changes,
        };
    }
}
exports.PsnpGameStandardDoc = PsnpGameStandardDoc;
//# sourceMappingURL=game.impl.js.map