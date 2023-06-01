import {PsnpEntity} from './psnpEntity.js';
import {type MongoDateField, type TrophyCount} from './common.js';
import type {ITrophyGroup, PsnpPageType, PsnpPageWithGames} from '../index.js';
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

	/** Converts `ms` into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
	 *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
	static msToSpeedString(ms: number): string {
		if (ms === 0) {
			return '0 seconds';
		}

		let seconds = ms / 1000;

		const timeUnits = [
			{unit: 'year', value: 31536000},
			{unit: 'month', value: 2626560}, // seconds in 30.4 days
			{unit: 'week', value: 604800},
			{unit: 'day', value: 86400},
			{unit: 'hour', value: 3600},
			{unit: 'minute', value: 60},
			{unit: 'second', value: 1},
		];

		let speedString = '';
		let countUnits = 0;

		for (const {unit, value} of timeUnits) {
			if (seconds >= value) {
				const count = Math.floor(seconds / value);
				seconds -= value * count;
				speedString += `${count} ${unit}${count > 1 ? 's' : ''}`;

				countUnits++;
				if (countUnits === 2) {
					break;
				}

				if (seconds > 0) {
					speedString += ', ';
				}
			}
		}

		return speedString;
	}

	/** Parses a Fastest Achiever's speed into ms. `speedString` is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
	static speedStringToMs(speedString: string): number {
		type TimeUnit = keyof typeof timeUnits;
		const timeUnits = {
			sec: 1,
			min: 60,
			hou: 3600,
			day: 86400,
			wee: 604800,
			mon: 2626560, // PSNP calculates a month as 30.4 days (https://forum.psnprofiles.com/topic/61709-bug-in-calculating-time-between-trophies/)
			yea: 31536000,
		} as const;

		const speeds = speedString.split(', ');
		let seconds = 0;

		for (const speed of speeds) {
			const [time, timeMetric] = speed.split(' ');
			const timeValue = parseInt(time!, 10);
			const timeUnit = timeMetric!.substring(0, 3) as TimeUnit;

			seconds += timeUnits[timeUnit] * timeValue;
		}
		return seconds * 1000;
	}

	/** Takes in a 'date played' element: \<div class="small-info" [...] */
	static timestampFromDatePlayed(element: HTMLElement): number | null {
		const textContent = element.textContent;
		if (!textContent) {
			return null;
		}

		const [dateText] = textContent.split('•').map(s => s.trim());
		if (!dateText) {
			throw new Error(`Unable to parse Date Played "${textContent}" into a timestamp`);
		}
		const cleanedDateText = dateText.replace(/(\d+)(st|nd|rd|th)/, '$1').trim();

		return new Date(cleanedDateText).valueOf();
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
