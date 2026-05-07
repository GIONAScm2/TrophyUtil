export const TROPHY_GRADE_POINTS = {
	Bronze: 15,
	Silver: 30,
	Gold: 90,
	Platinum: 300,
} as const;
export type TrophyGrade = keyof typeof TROPHY_GRADE_POINTS;

export const TROPHY_GRADES = Object.keys(TROPHY_GRADE_POINTS) as TrophyGrade[];

/** Represents a PSNProfiles trophy list group. */
export interface TrophyGroup {
	/** Base game is group `0`; this number is incremented for each DLC group. */
	groupNum: number;
	name: string;
	trophies: Trophy[];
}

export interface Trophy {
	/** Number that identifies a trophy within a PSNProfiles trophy list. */
	id: number;
	slug: string;
	name: string;
	desc: string;
	grade: TrophyGrade;
	rarity: number;
	imagePath: string;
	/** UTC timestamp in milliseconds. */
	dateEarned?: number | undefined;
}
