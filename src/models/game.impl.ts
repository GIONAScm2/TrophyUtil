import { PsnpEntity } from './psnpEntity.js';
import type { TrophyCount } from './common.js';
import { Select } from '../util/psnp/select.js';
import type {
	StackAbbr,
	PlatformTag,
	PlayableGame,
	GameListing,
	GameBase,
	CompletionStatus,
} from './game.interface.js';
import { isPsnpPageWithGames, type PsnpPageType } from '../util/psnp/pageType.js';

export class PsnpGameBase extends PsnpEntity implements GameBase {
	platforms: PlatformTag[];
	stackLabel?: StackAbbr | null;
	trophyCount?: TrophyCount;
	numTrophies?: number;
	points?: number;

	override get url(): string {
		return `https://psnprofiles.com/trophies/${this.id}-${this.slug}`;
	}
	override get src(): string {
		return `https://i.psnprofiles.com/games/${this.imagePath}.png`;
	}

	constructor(data: GameBase) {
		super(data);
		this.platforms = data.platforms;
		if ('stackLabel' in data) this.stackLabel = data.stackLabel;
		if (data.trophyCount !== undefined) this.trophyCount = data.trophyCount;
		if (data.numTrophies !== undefined) this.numTrophies = data.numTrophies;
		if (data.points !== undefined) this.points = data.points;
	}

	/**
	 * Given a PSNProfiles page type and document, returns matching game table rows.
	 * @param pageType Type of PSNProfiles page
	 * @param doc Document to parse nodes from
	 */
	static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[] {
		const selectors = isPsnpPageWithGames(pageType) ? Select.gameNodes[pageType] : [];
		const nodes = selectors.flatMap(selector => [...doc.querySelectorAll<HTMLTableRowElement>(selector)]);
		return nodes;
	}
}

export class PsnpGameListing extends PsnpGameBase implements GameListing {
	override stackLabel: StackAbbr | null;
	override trophyCount: TrophyCount;
	override numTrophies: number;
	override points: number;
	numOwners: number;

	constructor(data: GameListing) {
		super(data);
		this.stackLabel = data.stackLabel;
		this.trophyCount = data.trophyCount;
		this.numTrophies = data.numTrophies;
		this.points = data.points;
		this.numOwners = data.numOwners;
	}
}

export class PsnpPlayableGame extends PsnpGameBase implements PlayableGame {
	override stackLabel: StackAbbr | null;
	override trophyCount: TrophyCount;
	override numTrophies: number;
	override points: number;
	rarityBase: number;
	rarityDlc?: number | undefined;
	percent?: number | undefined;
	completionStatus?: CompletionStatus | undefined;
	completionSpeed?: number | undefined;
	completionRank?: string | undefined;
	latestTrophy?: number | undefined;

	constructor(data: PlayableGame) {
		super(data);
		this.stackLabel = data.stackLabel;
		this.trophyCount = data.trophyCount;
		this.numTrophies = data.numTrophies;
		this.points = data.points;
		this.rarityBase = data.rarityBase;
		this.rarityDlc = data.rarityDlc;
		this.percent = data.percent;
		this.completionStatus = data.completionStatus;
		this.completionSpeed = data.completionSpeed;
		this.completionRank = data.completionRank;
		this.latestTrophy = data.latestTrophy;
	}
}
