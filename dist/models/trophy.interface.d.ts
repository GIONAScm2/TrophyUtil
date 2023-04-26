export declare const TROPHY_GRADE_POINTS: {
    readonly Bronze: 15;
    readonly Silver: 30;
    readonly Gold: 90;
    readonly Platinum: 300;
};
export type TrophyGrade = keyof typeof TROPHY_GRADE_POINTS;
/** Represents a PSNP trophy list group. Each list contains at least 1 group (base game), plus one for each DLC pack. */
export interface ITrophyGroup {
    /** Base game is group `0`; this number is incremented for each DLC group. */
    groupNum: number;
    /** Name of trophy group. */
    name: string;
    /** Array of the group's trophies. */
    trophies: ITrophy[];
}
export interface ITrophy {
    /** Number that uniquely identifies a trophy within a PSNP trophy list, ranging from 1 to [number of trophies] */
    id: number;
    /** URL-serialized trophy name (e.g. `julius-caesar`) used to construct trophy page URL. */
    _nameSerialized: string;
    /** Trophy name */
    name: string;
    /** Trophy description */
    desc: string;
    /** Grade (type/tier) of trophy. */
    grade: TrophyGrade;
    /** Number (float) of the trophy's rarity. */
    rarity: number;
    /** URL fragment used to construct the full `src` URL of the trophy image. */
    _imagePath: string;
    /** Timestamp at which trophy was earned. */
    dateEarned?: number;
}
//# sourceMappingURL=trophy.interface.d.ts.map