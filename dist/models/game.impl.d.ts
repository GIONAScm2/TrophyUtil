import { PsnpEntity } from './psnpEntity.js';
import { type MongoDateField, type TrophyCount } from './common.js';
import type { ChangeData, ITrophyGroup, PsnpPageType } from '../index.js';
import type { StackAbbr, PlatformTag, IGameDoc, IGamePartialHome, IGamePartialTrophyList, IGamePlayable, IGameStandard, IMetadataFields, IGameBase } from './game.interface.js';
/** Class containing properties and methods applicable to all PSNP game types. */
export declare class PsnpGameBase<T extends IGameBase = IGameBase> extends PsnpEntity<T> implements IGameBase {
    platforms: PlatformTag[];
    stackLabel?: StackAbbr | null;
    trophyCount?: TrophyCount;
    numTrophies?: number;
    points?: number;
    get url(): string;
    get src(): string;
    constructor(data: IGameBase);
    /**
     * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     */
    static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[];
    /** Type predicate to narrow `game` type as a {@link IGamePartialTrophyList} */
    isGameFromStacks(game: any): game is IGamePartialTrophyList;
    /** Type predicate to narrow `game` type as a {@link IGamePartialHome} */
    isGameFromHome(game: any): game is IGamePartialHome;
    /** Type predicate to narrow `game` type as a {@link IGameStandard} */
    isGameStandard(game: any): game is IGameStandard;
    /** Type predicate to narrow `game` type as a {@link IGamePlayable} */
    isGamePlayable(game: any): game is IGamePlayable;
}
/** Class representing a standard PSNP game from `Games` or `GameSearch` */
export declare class PsnpGameStandard<T extends IGameStandard = IGameStandard> extends PsnpGameBase<T> implements IGameStandard {
    stackLabel: StackAbbr | null;
    trophyCount: TrophyCount;
    numTrophies: number;
    points: number;
    numOwners: number;
    constructor(data: IGameStandard);
}
export declare class PsnpGamePlayable<T extends IGamePlayable = IGamePlayable> extends PsnpGameBase<T> implements IGamePlayable {
    stackLabel: StackAbbr | null;
    trophyCount: TrophyCount;
    numTrophies: number;
    points: number;
    rarityBase: number;
    rarityDlc?: number;
    percent?: number;
    completionStatus?: 'platinum' | 'completed';
    completionSpeed?: number;
    latestTrophy?: number;
    constructor(data: IGamePlayable);
    /** Converts seconds into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
     *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
    static secondsToSpeedString(seconds: number): string;
    /** Parses a Fastest Achiever's speed as seconds. speedString is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
    static speedStringToSeconds(speedString: string): number;
    /** Takes in a 'date played' element: \<div class="small-info" [...] */
    static timestampFromDatePlayed(element: HTMLElement): number | null;
}
export declare class PsnpGameStandardDoc<T extends IGameDoc = IGameDoc> extends PsnpGameStandard<T> implements IGameDoc {
    trophies: ITrophyGroup[];
    rarityBase: number;
    rarityDlc?: number;
    forumId: number | null;
    metaData: IMetadataFields;
    createdAt?: MongoDateField;
    updatedAt?: MongoDateField;
    /** Flattens `trophies` trophy groups, returning a 2D array of all trophies. */
    get allTrophies(): import("./trophy.interface.js").ITrophy[] | undefined;
    constructor(data: IGameDoc);
    diffUpdate(oldGame: T | null | undefined, newGame: T, update: boolean): ChangeData<T>;
}
//# sourceMappingURL=game.impl.d.ts.map