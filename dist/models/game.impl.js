import { PsnpEntity } from './psnpEntity.js';
import { Select } from '../index.js';
/** Class containing properties and methods applicable to all PSNP game types. */
export class PsnpGameBase extends PsnpEntity {
    platforms;
    stackLabel;
    trophyCount;
    numTrophies;
    points;
    get url() {
        return `https://psnprofiles.com/trophies/${this._id}-${this._nameSerialized}`;
    }
    get src() {
        return `https://i.psnprofiles.com/games/${this._imagePath}.png`;
    }
    constructor(data) {
        super(data);
        this.platforms = data.platforms;
        this.stackLabel = data.stackLabel;
        this.trophyCount = data.trophyCount;
        this.numTrophies = data.numTrophies;
        this.points = data.points;
    }
    /**
     * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     */
    static getGameNodes(pageType, doc) {
        const selectors = Select.gameNodes[pageType] ?? '';
        const nodes = selectors.flatMap(selector => [...doc.querySelectorAll(selector)]);
        return nodes;
    }
}
/** Class representing a standard PSNP game from `Games` or `GameSearch` */
export class PsnpGameStandard extends PsnpGameBase {
    stackLabel;
    trophyCount;
    numTrophies;
    points;
    numOwners;
    constructor(data) {
        super(data);
        this.stackLabel = data.stackLabel;
        this.trophyCount = data.trophyCount;
        this.numTrophies = data.numTrophies;
        this.points = data.points;
        this.numOwners = data.numOwners;
    }
}
export class PsnpGamePlayable extends PsnpGameBase {
    stackLabel;
    trophyCount;
    numTrophies;
    points;
    rarityBase;
    rarityDlc;
    percent;
    completionStatus;
    completionSpeed;
    completionRank;
    latestTrophy;
    constructor(data) {
        super(data);
        this.stackLabel = data.stackLabel;
        this.trophyCount = data.trophyCount;
        this.numTrophies = data.numTrophies;
        this.points = data.points;
        this.rarityBase = data.rarityBase;
        this.rarityDlc = data.rarityDlc;
        this.percent = data.percent;
        this.completionStatus = data.completionStatus;
        this.completionSpeed = data.completionSpeed;
        this.completionRank = data.completionRank;
        this.latestTrophy = data.latestTrophy;
    }
}
export class PsnpGameStandardDoc extends PsnpGameStandard {
    trophyGroups;
    rarityBase;
    rarityDlc;
    forumId;
    metaData;
    createdAt;
    updatedAt;
    stackIds;
    /** Flattens `trophies` trophy groups, returning a 2D array of all trophies. */
    get allTrophies() {
        return this.trophyGroups.flatMap(s => s.trophies);
    }
    constructor(data) {
        super(data);
        this.trophyGroups = data.trophyGroups;
        this.rarityBase = data.rarityBase;
        this.rarityDlc = data.rarityDlc;
        this.forumId = data.forumId;
        this.metaData = data.metaData;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.stackIds = data.stackIds;
    }
}
//# sourceMappingURL=game.impl.js.map