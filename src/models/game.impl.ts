import {PsnpEntity} from './psnpEntity.js';
import {type MongoDateField, type TrophyCount} from './common.js';
import type {ITrophyGroup} from '../index.js';
import {Select} from '../index.js';
import type {
	StackAbbr,
	PlatformTag,
	IGameDoc,
	IGamePlayable,
	IGameStandard,
	IMetadataFields,
	IGameBase,
} from './game.interface.js';
import {PsnpPageType, PsnpPageWithGames} from '../util/psnp/pageType.js';

/** Class containing properties and methods applicable to all PSNP game types. */
export class PsnpGameBase extends PsnpEntity implements IGameBase {
	platforms: PlatformTag[];
	stackLabel?: StackAbbr | null | undefined;
	trophyCount?: TrophyCount | undefined;
	numTrophies?: number | undefined;
	points?: number | undefined;

	get url() {
		return `https://psnprofiles.com/trophies/${this._id}-${this._nameSerialized}`;
	}
	get src() {
		return `https://i.psnprofiles.com/games/${this._imagePath}.png`;
	}

	constructor(data: IGameBase) {
		super(data);
		this.platforms = data.platforms;
		this.stackLabel = data.stackLabel;
		this.trophyCount = data.trophyCount;
		this.numTrophies = data.numTrophies;
		this.points = data.points;
	}

	/**
	 * Given a {@link PsnpPageType} and document, parses and returns an array of game nodes.
	 * @param pageType Type of PSNProfiles page
	 * @param doc Document to parse nodes from
	 */
	static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[] {
		const selectors = Select.gameNodes[pageType as PsnpPageWithGames] ?? '';
		const nodes = selectors.flatMap(selector => [...doc.querySelectorAll<HTMLTableRowElement>(selector)]);
		return nodes;
	}
}

/** Class representing a standard PSNP game from `Games` or `GameSearch` */
export class PsnpGameStandard extends PsnpGameBase implements IGameStandard {
	stackLabel: StackAbbr | null;
	trophyCount: TrophyCount;
	numTrophies: number;
	points: number;
	numOwners: number;

	constructor(data: IGameStandard) {
		super(data);
		this.stackLabel = data.stackLabel;
		this.trophyCount = data.trophyCount;
		this.numTrophies = data.numTrophies;
		this.points = data.points;
		this.numOwners = data.numOwners;
	}
}

export class PsnpGamePlayable extends PsnpGameBase implements IGamePlayable {
	stackLabel: StackAbbr | null;
	trophyCount: TrophyCount;
	numTrophies: number;
	points: number;
	rarityBase: number;
	rarityDlc?: number | undefined;
	percent?: number | undefined;
	completionStatus?: 'platinum' | 'completed' | undefined;
	completionSpeed?: number | undefined;
	completionRank?: string | undefined;
	latestTrophy: number | undefined;

	constructor(data: IGamePlayable) {
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

export class PsnpGameStandardDoc extends PsnpGameStandard implements IGameDoc {
	trophyGroups: ITrophyGroup[];
	rarityBase: number;
	rarityDlc?: number | undefined;
	forumId: number | null;
	metaData: IMetadataFields;
	createdAt?: MongoDateField | undefined;
	updatedAt?: MongoDateField | undefined;

	/** Flattens `trophies` trophy groups, returning a 2D array of all trophies. */
	get allTrophies() {
		return this.trophyGroups.flatMap(s => s.trophies);
	}

	constructor(data: IGameDoc) {
		super(data);
		this.trophyGroups = data.trophyGroups;
		this.rarityBase = data.rarityBase;
		this.rarityDlc = data.rarityDlc;
		this.forumId = data.forumId;
		this.metaData = data.metaData;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}
