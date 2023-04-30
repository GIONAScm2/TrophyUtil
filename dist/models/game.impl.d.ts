import { MongoDateField, PsnpEntity, TrophyCount } from './common.js';
import { ChangeData, ITrophyGroup, PsnpPageType } from '../index.js';
import { StackAbbrNullable, PlatformTag, IGameStandardDoc, IGamePartialHome, IGamePartialTrophyList, IGamePlayable, IGameStandard, GameBase, MetadataFields } from './game.interface.js';
export declare function sumTrophyCount(tc: TrophyCount): number;
export declare function calculateTrophyPoints(tc: TrophyCount): number;
export declare function isGameFromStacks(game: any): game is IGamePartialTrophyList;
export declare function isGameFromHome(game: any): game is IGamePartialHome;
export declare function isGameStandard(game: any): game is IGameStandard;
export declare function isGamePlayable(game: any): game is IGamePlayable;
export declare abstract class PsnpGameBase extends PsnpEntity implements GameBase, Partial<IGamePartialHome> {
    platforms: PlatformTag[];
    trophyCount?: TrophyCount;
    get url(): string;
    get src(): string;
    /** (Getter) Calculates game's point value based on its trophy count. */
    get points(): number;
    constructor(data: GameBase);
    /**
     * Parses game nodes from a given page. Server-side calls must explicitly pass a JSDOM document.
     * @param pageType Type of PSNProfiles page
     * @param doc Document to parse nodes from
     * @returns
     */
    static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[];
}
export declare class PsnpGamePartial extends PsnpGameBase {
    stackLabel?: StackAbbrNullable;
    constructor(data: IGamePartialHome | IGamePartialTrophyList);
}
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
    metaData?: MetadataFields;
    createdAt: MongoDateField;
    updatedAt: MongoDateField;
    get trophies(): import("./trophy.interface.js").ITrophy[] | undefined;
    constructor(data: IGameStandardDoc);
    /** Updates fields and returns a log of changes. */
    static diffUpdate(oldGame: IGameStandardDoc | null | undefined, newGame: IGameStandardDoc, update: boolean): ChangeData<IGameStandardDoc>;
}
//# sourceMappingURL=game.impl.d.ts.map