import {PsnpParser} from '../psnpParser.js';
import {TrophyCount, calculateTrophyPoints} from '../../models/common.js';
import {ParserTrophyGroups} from '../trophies/trophyGroups.js';
import {ParserGamePartialStack} from './gameFromStackPanel.js';
import {PlatformTag, IGamePage, IMetadataFields, IGamePartialTrophyList, IHeaderStats} from '../../models/game.interface.js';
import {parseNum, getStackAbbr} from '../../util/util.js';
import {ITrophy} from '../../models/trophy.interface.js';

/** Parses a partial game representation from TrophyList pages. */
export class ParserGamePage extends PsnpParser<IGamePage, Document> {
	protected readonly type = 'Game Page';

	protected _parse(doc: Document): IGamePage | null {
		const navTabs = [...doc.querySelectorAll<HTMLAnchorElement>(`ul.navigation > li > a[href]`)];

		const forumLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Forum');
		const forumIdAndGameName = this._extractIdAndTitleFromPsnpUrl({url: forumLink?.href});

		const trophyListLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Trophies');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({url: trophyListLink?.href});

		if (!hrefIdAndTitle) {
			return null;
		}
		const [_id, _nameSerialized] = hrefIdAndTitle;
		const forumId = (forumIdAndGameName?.at(0) as number) || null;

		const name = doc
			.querySelector(`#banner > div.banner-overlay > div > div.title-bar.flex.v-align > div.grow > h3 > span`)
			?.nextSibling?.textContent?.trim();
		if (!name) {
			return null;
		}

		const trophyGroupsParser = new ParserTrophyGroups();
		const trophyGroups = trophyGroupsParser.parse(doc);

		const trophies = trophyGroups.flatMap(group => group.trophies);
		const trophyCount = trophiesToTrophyCount(trophies);
		const numTrophies = trophies.length;
		const points = calculateTrophyPoints(trophyCount);

		const metaData = this.parseMetadata(doc);

		const stacks: IGamePartialTrophyList[] = [];
		const sideDivHeaders = [...doc.querySelectorAll('div.col-xs-4 >  div.title.flex.v-align > div.grow > h3')];
		const stackDivHeader = sideDivHeaders.find(h3 => h3.textContent?.trim() === 'Other Platforms and Regions');
		const stackTable = stackDivHeader?.closest(`div.title.flex.v-align`)?.nextElementSibling;
		if (stackTable) {
			const gameParser = new ParserGamePartialStack();
			const games = [...stackTable.querySelectorAll('tr')].map(tr => gameParser.parse(tr));
			stacks.push(...games);
		}

		let seriesIds: number[] | undefined;
		const seriesElements = [...doc.querySelectorAll<HTMLAnchorElement>('a.series-info')];
		if (seriesElements.length) {
			seriesIds = seriesElements.map(el => {
				const match = el.href.match(/series\/(\d+)/) ?? [];
				return +match[1];
			});
		}

		const headerStatElements = [...doc.querySelectorAll<HTMLSpanElement>(`div.stats.flex > span.stat`)];
		const stats = this.parseHeaderStats(headerStatElements);
		if (!stats) {
			return null;
		}

		const rarityBase = calculatePercent(stats.numPlatted ?? stats.num100Percented, stats.gameOwners);

		let rarityDlc: number | undefined;
		if (stats.numPlatted && stats.numPlatted !== stats.num100Percented) {
			rarityDlc = calculatePercent(stats.num100Percented, stats.gameOwners);
		}

		const platformTags = [...doc.querySelectorAll<HTMLSpanElement>(`div.no-top-border div.platforms > span`)];
		const platforms = platformTags.map(span => span.textContent!.trim() as PlatformTag).sort();
		if (!platforms.length) {
			return null;
		}

		const stackEl = doc.querySelector('table.zebra tr > th.center');
		const stackText = stackEl?.textContent?.trim()?.replace(/\sVersion/, '') ?? '';
		const stackLabel = getStackAbbr(stackText);

		return {
			_id,
			name,
			_nameSerialized,
			forumId,
			platforms,
			stackLabel,
			trophyCount,
			numTrophies,
			points,
			numOwners: stats.gameOwners,
			stacks,
			stackIds: stacks.map(s => s._id),
			trophyGroups: trophyGroups,
			headerStats: stats,
			rarityBase,
			rarityDlc,
			metaData,
			seriesIds,
		};
	}

	/** Parses {@link IMetadataFields} from the trophy list. */
	protected parseMetadata(doc: Document): IMetadataFields {
		const metadataRows = [...doc.querySelectorAll<HTMLTableRowElement>(`table.gameInfo tr`)].filter(
			tr => tr.cells.length > 1
		);

		const getValueOf = <IsMultiple extends boolean = false>(
			propName: string,
			multiple = false
		): IsMultiple extends true ? string[] | undefined : string | undefined => {
			const row = metadataRows.find(row => row.cells[0]?.textContent?.trim()?.includes(propName));
			if (!row) return;

			const valueString = row.cells[1].textContent?.trim() ?? '';
			if (!valueString) return;

			const values = valueString.split(', ').map(val => val.trim());
			if (multiple) {
				return values as IsMultiple extends true ? string[] | undefined : string | undefined;
			}
			return values[0] as IsMultiple extends true ? string[] | undefined : string | undefined;
		};

		const metadata = {
			developer: getValueOf('Developer'),
			publisher: getValueOf('Publisher'),
			genres: getValueOf<true>('Genres', true),
			themes: getValueOf<true>('Themes', true),
			modes: getValueOf<true>('Mode', true),
			otherNames: getValueOf<true>('Other Name', true),
		};
		return metadata;
	}

	/** Parses `stats` to return {@link IHeaderStats} or `null`. */
	protected parseHeaderStats(stats: HTMLSpanElement[]): IHeaderStats | null {
		const findStat = (statName: string) => stats.find(span => span.textContent?.includes(statName));

		const gameOwners = parseNum(findStat('Game Owner')?.firstChild);
		const recentPlayers = parseNum(findStat('Recent Player')?.firstChild);
		const avgCompletion = parseNum(findStat('Average Completion')?.firstChild);
		const trophiesEarned = parseNum(findStat('Earned')?.firstChild);
		const num100Percented = parseNum(findStat('100% Completed')?.firstChild);

		const platAchievers = parseNum(findStat('Platinum Achiever')?.firstChild);
		const numPlatted = Number.isNaN(platAchievers) ? undefined : platAchievers;

		return {gameOwners, recentPlayers, numPlatted, avgCompletion, trophiesEarned, num100Percented};
	}
}

function trophiesToTrophyCount(trophies: ITrophy[], trophyCount?: TrophyCount): TrophyCount {
	let tc: TrophyCount = trophyCount ?? {bronze: 0, silver: 0, gold: 0, platinum: 0};

	for (const trophy of trophies) {
		if (trophy.grade === 'Bronze') tc.bronze++;
		else if (trophy.grade === 'Silver') tc.silver++;
		else if (trophy.grade === 'Gold') tc.gold++;
		else if (trophy.grade === 'Platinum') tc.platinum++;
	}

	return tc;
}

function calculatePercent(dividend: number, divisor: number): number {
	if (dividend === 0 && divisor === 0) return 0;

	const percent = (dividend / divisor) * 100;
	const percentRounded = Math.round(percent * 100) / 100;

	return percentRounded;
}
