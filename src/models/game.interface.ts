import type { TrophyCountFields } from './common.js';
import type { PsnpEntityData } from './psnpEntity.js';
import type { TrophyGroup } from './trophy.interface.js';
import type { MakeOptional } from '../util/util.js';

/** Maps abbreviated PSNProfiles stack labels to their display names. */
export const STACK_LOOKUP = {
	NA: 'North American',
	EU: 'European',
	WW: 'Worldwide',
	HK: 'Hong Kong',
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
	SA: 'Saudi Arabian',
	// Non-regions:
	DG: 'Digital',
	PH: 'Physical',
	RR: 'Rereleased',
	OR: 'Original',
	BO: 'Bonus/Bundle',
} as const;

export type StackAbbr = keyof typeof STACK_LOOKUP;
export type StackFull = (typeof STACK_LOOKUP)[StackAbbr];

export const PLATFORM_TAGS = ['Vita', 'VR', 'PS3', 'PS4', 'PS5'] as const;
export type PlatformTag = (typeof PLATFORM_TAGS)[number];

export type CompletionStatus = 'platinum' | 'completed';

interface Platforms {
	platforms: PlatformTag[];
}

interface Rarity {
	/** First displayed rarity; de facto platinum rarity for games with a platinum. */
	rarityBase: number;
	/** Second displayed rarity; de facto DLC rarity when present. */
	rarityDlc?: number | undefined;
}

export interface MetadataFields {
	developer?: string | undefined;
	publisher?: string | undefined;
	genres?: string[] | undefined;
	themes?: string[] | undefined;
	modes?: string[] | undefined;
	otherNames?: string[] | undefined;
}

export interface HeaderStats {
	gameOwners: number;
	recentPlayers: number;
	numPlatted: number | undefined;
	avgCompletion: number;
	trophiesEarned: number;
	num100Percented: number;
}

interface UserProgress {
	/** Completion percent, or `undefined` when PSNProfiles does not render a progress bar. */
	percent?: number | undefined;
	completionStatus?: CompletionStatus | undefined;
	/** Completion speed in milliseconds, or `undefined` if incomplete. */
	completionSpeed?: number | undefined;
	completionRank?: string | undefined;
	/** UTC timestamp in milliseconds. */
	latestTrophy?: number | undefined;
}

interface StackLabel {
	stackLabel: StackAbbr | null;
}

interface GamePageData {
	forumId: number | null;
	trophyGroups: TrophyGroup[];
	stacks: GameStackEntry[];
	stackIds?: number[] | undefined;
	headerStats: HeaderStats;
	metadata: MetadataFields;
	seriesIds?: number[] | undefined;
}

export interface GameStack extends Platforms, StackLabel {
	/** Label that distinguishes stacks using platform and/or region details. */
	stack?: string;
	platformString?: string;
	stackLabels?: string[];
}

interface GameIdentity extends PsnpEntityData, Platforms {}

export interface GameBase extends GameIdentity, Partial<TrophyCountFields & StackLabel> {}

export interface GameStackEntry extends GameIdentity, StackLabel {}
export interface GameHomeListing extends GameIdentity, TrophyCountFields {}

interface FullGameBase extends GameStackEntry, GameHomeListing {}

export interface GameListing extends FullGameBase {
	numOwners: number;
}

export interface PlayableGame extends FullGameBase, Rarity, UserProgress {}

export interface GamePage extends MakeOptional<GameListing, 'imagePath'>, Rarity, GamePageData {}

export interface GameDlc extends GameIdentity, TrophyCountFields, Omit<TrophyGroup, 'trophies'> {
	dlcName: string;
}
