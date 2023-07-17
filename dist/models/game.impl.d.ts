import { PsnpEntity } from './psnpEntity.js';
import { type MongoDateField, type TrophyCount } from './common.js';
import type { ITrophyGroup } from '../index.js';
import type { StackAbbr, PlatformTag, IGameDoc, IGamePlayable, IGameStandard, IMetadataFields, IGameBase } from './game.interface.js';
import { PsnpPageType } from '../util/psnp/pageType.js';
/** Class containing properties and methods applicable to all PSNP game types. */
export declare class PsnpGameBase extends PsnpEntity implements IGameBase {
    platforms: PlatformTag[];
    stackLabel?: StackAbbr | null | undefined;
    trophyCount?: TrophyCount | undefined;
    numTrophies?: number | undefined;
    points?: number | undefined;
    get url(): string;
    get src(): string;
    constructor(data: IGameBase);
    /**
     * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     */
    static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[];
}
/** Class representing a standard PSNP game from `Games` or `GameSearch` */
export declare class PsnpGameStandard extends PsnpGameBase implements IGameStandard {
    stackLabel: StackAbbr | null;
    trophyCount: TrophyCount;
    numTrophies: number;
    points: number;
    numOwners: number;
    constructor(data: IGameStandard);
}
export declare class PsnpGamePlayable extends PsnpGameBase implements IGamePlayable {
    stackLabel: StackAbbr | null;
    trophyCount: TrophyCount;
    numTrophies: number;
    points: number;
    rarityBase: number;
    rarityDlc?: number | undefined;
    percent?: number | undefined;
    completionStatus?: 'platinum' | 'completed' | undefined;
    completionSpeed?: number | undefined;
    completionRank?: string | undefined;
    latestTrophy: number | undefined;
    constructor(data: IGamePlayable);
}
export declare class PsnpGameStandardDoc extends PsnpGameStandard implements IGameDoc {
    trophyGroups: ITrophyGroup[];
    rarityBase: number;
    rarityDlc?: number | undefined;
    forumId: number | null;
    metaData: IMetadataFields;
    createdAt?: MongoDateField | undefined;
    updatedAt?: MongoDateField | undefined;
    stackIds?: number[] | undefined;
    /** Flattens `trophies` trophy groups, returning a 2D array of all trophies. */
    get allTrophies(): import("./trophy.interface.js").ITrophy[];
    constructor(data: IGameDoc);
}
//# sourceMappingURL=game.impl.d.ts.map