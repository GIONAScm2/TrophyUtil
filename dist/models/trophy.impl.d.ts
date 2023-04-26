import { ITrophy, TrophyGrade } from './trophy.interface.js';
export declare class PsnpTrophy implements ITrophy {
    id: number;
    name: string;
    desc: string;
    grade: TrophyGrade;
    rarity: number;
    _nameSerialized: string;
    _imagePath: string;
    dateEarned?: number | undefined;
    constructor(trophy: ITrophy);
    /** (Getter) Constructs and returns trophy list URL fragment (e.g. `50-abstergo-employee-of-the-month`). */
    get urlPath(): string;
    /** (Getter) Constructs and returns trophy icon URL fragment (e.g. `trophies/33S08e7cc.png`). */
    get src(): string;
    /** Trophy rarity formatted with two decimal places. */
    get rarityString(): string;
    /** Parses a trophy element's 'date earned' into a date timestamp. */
    static timestampFromDateEarned(element: HTMLElement): number;
}
//# sourceMappingURL=trophy.impl.d.ts.map