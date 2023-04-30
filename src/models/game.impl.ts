import {MongoDateField, PsnpEntity, TrophyCount} from './common.js';
import {ChangeData, ITrophyGroup, PsnpPageType, PsnpPageWithGames, Select, diffAndUpdateSharedProps} from '../index.js';
import {
	StackAbbrNullable,
	PlatformTag,
	IGameStandardDoc,
	IGamePartialHome,
	IGamePartialTrophyList,
	IGamePlayable,
	IGameStandard,
	GameBase,
	MetadataFields,
} from './game.interface.js';

// Type predicates
const percentKey: keyof IGamePlayable = 'percent';
const trophyCountKey: keyof IGamePartialHome = 'trophyCount';
const stackLabelKey: keyof IGameStandard = 'stackLabel';

export function sumTrophyCount(tc: TrophyCount): number {
	return tc.bronze + tc.silver + tc.gold + tc.platinum;
}

export function calculateTrophyPoints(tc: TrophyCount): number {
	return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}

export function isGameFromStacks(game: any): game is IGamePartialTrophyList {
	return !(percentKey in game) && !(trophyCountKey in game);
}
export function isGameFromHome(game: any): game is IGamePartialHome {
	return !(percentKey in game) && trophyCountKey in game;
}
export function isGameStandard(game: any): game is IGameStandard {
	return !(percentKey in game) && trophyCountKey in game && stackLabelKey in game;
}
export function isGamePlayable(game: any): game is IGamePlayable {
	return percentKey in game;
}

export abstract class PsnpGameBase extends PsnpEntity implements GameBase, Partial<IGamePartialHome> {
	platforms: PlatformTag[];
	trophyCount?: TrophyCount;

	get url() {
		return `https://psnprofiles.com/trophies/${this._id}-${this._nameSerialized}`;
	}
	get src() {
		return `https://i.psnprofiles.com/games/${this._imagePath}.png`;
	}

	/** (Getter) Calculates game's point value based on its trophy count. */
	get points(): number {
		return this.trophyCount ? calculateTrophyPoints(this.trophyCount) : Number.NaN;
	}

	constructor(data: GameBase) {
		super(data);
		this.platforms = data.platforms;
	}

	/**
	 * Parses game nodes from a given page. Server-side calls must explicitly pass a JSDOM document.
	 * @param pageType Type of PSNProfiles page
	 * @param doc Document to parse nodes from
	 * @returns
	 */
	static getGameNodes(pageType: PsnpPageType, doc: Document): HTMLTableRowElement[] {
		const selectors = Select.gameNodes[pageType as PsnpPageWithGames] ?? '';
		const nodes = selectors.flatMap(selector => [...doc.querySelectorAll<HTMLTableRowElement>(selector)]);
		return nodes;
	}
}

export class PsnpGamePartial extends PsnpGameBase {
	stackLabel?: StackAbbrNullable;

	constructor(data: IGamePartialHome | IGamePartialTrophyList) {
		super(data);
		if (isGameFromHome(data)) {
			this.trophyCount = data.trophyCount;
		}
		if (isGameFromStacks(data)) {
			this.stackLabel = data.stackLabel;
		}
	}
}

export class PsnpGameStandard extends PsnpGameBase implements IGameStandard {
	trophyCount: TrophyCount;
	stackLabel: StackAbbrNullable;
	numOwners: number;
	numTrophies: number;

	constructor(data: IGameStandard) {
		super(data);
		this.trophyCount = data.trophyCount;
		this.stackLabel = data.stackLabel;
		this.numOwners = data.numOwners;
		this.numTrophies = data.numTrophies;
	}
}

export class PsnpGamePlayable extends PsnpGameBase implements IGamePlayable {
	stackLabel: StackAbbrNullable;
	percent: number | null;
	completionStatus?: 'platinum' | 'completed';
	completionSpeed?: number;
	rarityBase: number;
	rarityDLC?: number;
	latestTrophy?: number;

	constructor(data: IGamePlayable) {
		super(data);
		this.stackLabel = data.stackLabel;
		this.percent = data.percent;
		this.completionStatus = data.completionStatus;
		this.completionSpeed = data.completionSpeed;
		this.rarityBase = data.rarityBase;
		this.rarityDLC = data.rarityDlc;
		this.latestTrophy = data.latestTrophy;
	}

	/** Converts seconds into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
	 *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
	static secondsToSpeedString(seconds: number): string {
		if (seconds === 0) {
			return '0 seconds';
		}

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

	/** Parses a Fastest Achiever's speed as seconds. speedString is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
	static speedStringToSeconds(speedString: string): number {
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
		return seconds;
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

export class PsnpGameStandardDoc extends PsnpGameStandard implements IGameStandardDoc {
	trophyGroups: ITrophyGroup[];
	rarityBase: number;
	rarityDlc?: number;
	metaData?: MetadataFields;
	createdAt: MongoDateField;
	updatedAt: MongoDateField;

	get trophies() {
		if (!this.trophyGroups) return;
		return this.trophyGroups.flatMap(s => s.trophies);
	}

	constructor(data: IGameStandardDoc) {
		super(data);
		this.trophyGroups = data.trophyGroups;
		this.rarityBase = data.rarityBase;
		this.rarityDlc = data.rarityDlc;
		this.metaData = data.metaData;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}

	/** Updates fields and returns a log of changes. */
	static diffUpdate(
		oldGame: IGameStandardDoc | null | undefined,
		newGame: IGameStandardDoc,
		update: boolean
	): ChangeData<IGameStandardDoc> {
		const commonChanges = {id: newGame._id, changes: []};

		if (!oldGame) {
			return {...commonChanges, operation: 'add'};
		}
		if (oldGame._id !== newGame._id) {
			throw new Error(
				`ID mismatch: Cannot update game '${oldGame.toString()}' using game '${newGame.toString()}'`
			);
		}

		const changes = diffAndUpdateSharedProps(oldGame, newGame, update);

		return {
			...commonChanges,
			operation: 'update',
			changes,
		};
	}
}
