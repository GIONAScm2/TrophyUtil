import { type MongoDateField, type TrophyCount, PsnpEntity } from './common.js';
import type { ChangeData, ITrophyGroup, PsnpPageType } from '../index.js';
import type { StackAbbrNullable, PlatformTag, IGameStandardDoc, IGamePartialHome, IGamePartialTrophyList, IGamePlayable, IGameStandard, IGameBase, IMetadataFields } from './game.interface.js';
/** Type predicate to narrow `game` type as a {@link IGamePartialTrophyList} */
export declare function isGameFromStacks(game: any): game is IGamePartialTrophyList;
/** Type predicate to narrow `game` type as a {@link IGamePartialHome} */
export declare function isGameFromHome(game: any): game is IGamePartialHome;
/** Type predicate to narrow `game` type as a {@link IGameStandard} */
export declare function isGameStandard(game: any): game is IGameStandard;
/** Type predicate to narrow `game` type as a {@link IGamePlayable} */
export declare function isGamePlayable(game: any): game is IGamePlayable;
/** Abstract class containing properties and methods applicable to all PSNP game types. */
export declare abstract class PsnpGameBase extends PsnpEntity implements IGameBase, Partial<IGamePartialHome> {
    platforms: PlatformTag[];
    trophyCount?: TrophyCount;
    get url(): string;
    get src(): string;
    /** (Getter) Calculates game's point value based on its trophy count. */
    get points(): number;
    constructor(data: IGameBase);
    /**
     * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     */
    static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[];
}
/** Class representing a primitive PSNP game from `Home` or `Other Platforms and Regions` */
export declare class PsnpGamePartial extends PsnpGameBase implements Partial<IGamePartialHome & IGamePartialTrophyList> {
    stackLabel?: StackAbbrNullable;
    constructor(data: IGamePartialHome | IGamePartialTrophyList);
}
/** Class representing a standard PSNP game from `Games` or `GameSearch` */
export declare class PsnpGameStandard extends PsnpGameBase implements IGameStandard {
    trophyCount: TrophyCount;
    stackLabel: StackAbbrNullable;
    numOwners: number;
    numTrophies: number;
    constructor(data: IGameStandard);
}
export declare class PsnpGamePlayable extends PsnpGameBase implements IGamePlayable {
    stackLabel: StackAbbrNullable;
    percent: number | null;
    completionStatus?: 'platinum' | 'completed';
    completionSpeed?: number;
    rarityBase: number;
    rarityDLC?: number;
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
export declare class PsnpGameStandardDoc extends PsnpGameStandard implements IGameStandardDoc {
    trophyGroups: ITrophyGroup[];
    rarityBase: number;
    rarityDlc?: number;
    metaData?: IMetadataFields;
    createdAt: MongoDateField;
    updatedAt: MongoDateField;
    get trophies(): import("./trophy.interface.js").ITrophy[] | undefined;
    constructor(data: IGameStandardDoc);
    /** Updates fields and returns a log of changes. */
    static diffUpdate(oldGame: IGameStandardDoc | null | undefined, newGame: IGameStandardDoc, update: boolean): ChangeData<IGameStandardDoc>;
}
//# sourceMappingURL=game.impl.d.ts.map