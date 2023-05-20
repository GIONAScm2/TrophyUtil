import {IPsnpEntity, ITrophyCount, IMongoTimestamps, MakeOptional, MongoDateField, TrophyCount} from '../index.js';
import {ITrophyGroup} from './trophy.interface.js';

/** Abbreviated stack label that PSNP uses. */
export type StackAbbr = keyof typeof StackLookup;
/** Full stack label that PSNP uses. */
export type StackFull = (typeof StackLookup)[StackAbbr];

/** Maps {@link StackAbbr} to non-abbreviated name. */
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

export type PlatformTag = 'Vita' | 'VR' | 'PS3' | 'PS4' | 'PS5';

//
// Base interfaces
//

/** `rarityBase`, `*rarityDlc`. */
interface IRarity {
	/** Number (float) of the first displayed rarity; de facto 'platinum rarity'. */
	rarityBase: number;
	/** Number (float) of the second displayed rarity; de facto 'DLC rarity'. `undefined` if no DLC rarity is present. */
	rarityDlc?: number;
}
/** `*developer`, `*publisher`, `*genres`, `*themes`, `*modes`, and `*otherNames`. */
export interface IMetadataFields {
	developer?: string;
	publisher?: string;
	genres?: string[];
	themes?: string[];
	modes?: string[];
	otherNames?: string[];
}
/** `gameOwners`, `recentPlayers`, `avgCompletion`, `trophiesEarned`, `num100Percented`, `*numPlatted`. */
export interface IHeaderStats {
	/** Number of game owners. */
	gameOwners: number;
	/** Number of recent players. */
	recentPlayers: number;
	/** Number of tracked users that platted the game, or `undefined` if game is a nonplat. */
	numPlatted?: number;
	/** Average completion percentage. */
	avgCompletion: number;
	/** Total number of trophies tracked users have earned across the site. */
	trophiesEarned: number;
	/** Number of tracked users that have 100%'d the game. For games without DLC, this is equivalent to {@link numPlatted}. */
	num100Percented: number;
}
/** `*percent`, `*completionStatus`, `*completionSpeed`, and `*latestTrophy`. */
interface IUserProgress {
	/** Completion % (integer), or `undefined` if the game doesn't have a progress bar (e.g. unplayed games on series pages). */
	percent?: number;
	/** Type of game completion based on game's `class` attribute.
	 *
	 * If a game is platted, it will have the `platinum` class regardless of whether there's DLC.
	 * If a game is a 100%'d nonplat, it will have the `completed` class. */
	completionStatus?: 'platinum' | 'completed';
	/** Completion speed in seconds, or `undefined` if game is incomplete.
	 *
	 * Note that 'platinum in [SPEED 1]' changes to 'completed in [SPEED 2]' if a game has
	 * DLC trophies that the user completes. */
	completionSpeed?: number;
	/** Timestamp at which the most recent trophy was earned (ms). `undefined` for games at 0% (or unplayed series games). */
	latestTrophy?: number;
}
/** `stackLabel`. */
interface IStackLabel {
	/** PSNP's abbreviated stack label (`StackAbbr`).
	 *
	 * **Note:** Stored games may have a value of `WW` even if no stack label is present on PSNP.
	 * This indicates a manual correction, so exert caution when updating DB games using freshly-parsed DOM games. */
	stackLabel: StackAbbr | null;
}
/** All page-specific game properties (`forumId`, `trophies`, `stacks`, `headerStats`, `metaData`). */
interface IGamePageData {
	/** ID that uniquely identifies the game's PSNP subforum.
	 *
	 * **Note:** Some lists may not have a subforum. */
	forumId: number | null;
	/** Array of {@link ITrophyGroup} */
	trophies: ITrophyGroup[];
	/** List of {@link IGamePartialTrophyList} */
	stacks: IGamePartialTrophyList[];
	/** Aggregate stats; see {@link IHeaderStats} */
	headerStats: IHeaderStats;
	/** Game metadata like `developer`, `genres`, etc. */
	metaData: IMetadataFields;
}

//
// Composite interfaces
//

interface IBase extends IPsnpEntity {
	/** Array of all PSNP platform tags. */
	platforms: PlatformTag[];
}
/** Properties universal to all game types (optional). */
export interface IGameBase extends IBase, Partial<ITrophyCount & IStackLabel> {}

/** Game parsed from 'Other Platforms and Regions' section of trophy lists. */
export interface IGamePartialTrophyList extends IBase, IStackLabel {}
/** Game parsed from 'Home' page. */
export interface IGamePartialHome extends IBase, ITrophyCount {}

/** Properties universal to all game types (required). */
interface IGameBaseFull extends IGamePartialTrophyList, IGamePartialHome {}

/** Game parsed from 'Games' or 'GameSearch' pages. */
export interface IGameStandard extends IGameBaseFull {
	/** Number of game owners. */
	numOwners: number;
}
/** Game parsed from 'Profile' or 'Series' pages. */
export interface IGamePlayable extends IGameBaseFull, IRarity, IUserProgress {}

/** Game parsed from trophy list. */
export interface IGamePage extends MakeOptional<IGameStandard, '_imagePath'>, IRarity, IGamePageData {}

/** All *relevant* trophy list-specific game properties that supplement game listing data. */
interface IPageSupplement extends Pick<IGamePageData, 'forumId' | 'trophies' | 'metaData'> {}

/** Recommended MongoDB schema for standard games. */
export interface IGameDoc extends IGameStandard, IRarity, IPageSupplement, Partial<IMongoTimestamps> {}
/** Recommended MongoDB schema for playable games. */
export interface IGameDocPlayable extends IGameDoc, IRarity, IUserProgress {}

export interface IDlcListing extends IBase, ITrophyCount, Omit<ITrophyGroup, 'trophies'> {}
