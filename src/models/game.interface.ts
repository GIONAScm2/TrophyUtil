import {IPsnpEntity, ITrophyCount, MongoTimestamps} from '../index.js';
import {ITrophyGroup} from './trophy.interface.js';

export const StackLookup = {
	NA: 'North American',
	EU: 'European',
	WW: 'Worldwide',
	AS: 'Asian',
	JP: 'Japanese',
	CN: 'Chinese',
	KR: 'Korean',
	GER: 'German',
	AU: 'Australian',
	RU: 'Russian',
	WE: 'Western',
	UK: 'United Kingdom',
	FR: 'French',
	ES: 'Spanish',
	// Non-regions:
	DG: 'Digital',
	PH: 'Physical',
	RR: 'Rereleased',
	OR: 'Original',
} as const;
export type StackAbbr = keyof typeof StackLookup;
export type StackAbbrNullable = StackAbbr | null;
export type Stack = Record<StackAbbr, string>;

export type PlatformTag = 'Vita' | 'VR' | 'PS3' | 'PS4' | 'PS5';

/** `rarityBase` and optionally `rarityDlc` */
interface Rarity {
	/** Number (float) of the first displayed rarity; de facto 'platinum rarity'. */
	rarityBase: number;
	/** Number (float) of the second displayed rarity; de facto 'DLC rarity'. `undefined` if no DLC rarity is present. */
	rarityDlc?: number;
}

export interface MetadataFields {
	developer?: string;
	publisher?: string;
	genres?: string[];
	themes?: string[];
	modes?: string[];
	releases?: string[];
}
interface Metadata {
	metaData: MetadataFields;
}

/** Represents a game's header stats. */
interface HeaderStats {
	gameOwners: number;
	recentPlayers: number;
	numPlatted?: number;
	avgCompletion: number;
	/** Total number of trophies tracked users have earned. */
	trophiesEarned: number;
	num100Percented: number;
}

interface GameProgress {
	/** Completion % (integer). Unplayed games don't have a progress bar, so they'll be marked `null`. */
	percent: number | null;
	/** Type of game completion based on game's `class` attribute.
	 *
	 * If a game is platted, it will have the `platinum` class regardless of whether there's DLC.
	 * If a game is a 100%'d nonplat, it will have the `completed` class. */
	completionStatus?: 'platinum' | 'completed';
	/** Completion speed in seconds, or `null` if game is incomplete.
	 *
	 * Note that 'platinum in [SPEED 1]' changes to 'completed in [SPEED 2]' if a game has
	 * DLC trophies that the user completes. */
	completionSpeed?: number | null;
	/** Timestamp at which the most recent trophy was earned (ms). `undefined` for games at 0% (or unplayed series games). */
	latestTrophy?: number;
}

export interface GameBase extends IPsnpEntity {
	/** Array of all PSNP platform tags. */
	platforms: PlatformTag[];
}
interface StackLabel {
	/** PSNP's abbreviated stack label (`StackAbbr`), or `null` if no label is present.
	 *
	 * **Note:** Stored games may ocasionally have a value of `WW` even if no stack label is present.
	 * This indicates a correction, and should be respected. */
	stackLabel: StackAbbrNullable;
}

/** Only unplayed games have these properties. */
interface Unplayed {
	numOwners: number;
	numTrophies: number;
	points: number;
}

/** Games from Home page. */
export interface IGamePartialHome extends GameBase, ITrophyCount {
	points: number;
}
/** Games from TrophyList pages. */
export interface IGamePartialTrophyList extends GameBase, StackLabel {}

/** Games from Games and GameSearch pages. */
export interface IGameStandard extends GameBase, StackLabel, ITrophyCount, Unplayed {}

/** Games from Profile and Series pages. */
export interface IGamePlayable extends GameBase, StackLabel, Partial<ITrophyCount>, Rarity, GameProgress {}

export interface IGamePage extends GameBase, Metadata, Rarity {
	/** ID that uniquely identifies the game's PSNP subforum. */
	forumId: number;
	trophyGroups: ITrophyGroup[];
	stacks: IGamePartialTrophyList[];
	completionStats: HeaderStats;
}

/** Represents a neutral Game document containing all fields that should be stored. */
export interface IGameStandardDoc extends IGameStandard, Rarity, Partial<Metadata>, MongoTimestamps {
	trophyGroups: ITrophyGroup[];
}

/** Represents a user Game document containing all fields that should be stored. */
export interface IGamePlayableDoc extends IGamePlayable, Partial<Unplayed>, MongoTimestamps {}
