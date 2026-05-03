import { PsnpParser } from '../psnpParser.js';
import { calculateTrophyPoints, createEmptyTrophyCount, type TrophyCount } from '../../models/common.js';
import { TrophyGroupsParser } from '../trophies/trophyGroups.js';
import { GameStackEntryParser } from './gameFromStackPanel.js';
import type { GamePage, MetadataFields, GameStackEntry, HeaderStats } from '../../models/game.interface.js';
import { getStackAbbr, isPlatformTag, parseNumber } from '../../util/util.js';
import type { Trophy } from '../../models/trophy.interface.js';

/** Parses a full game trophy-list page. */
export class GamePageParser extends PsnpParser<GamePage, Document> {
	protected readonly expectedEntityType = 'Game Page';

	protected _parse(doc: Document): GamePage | null {
		const navTabs = [...doc.querySelectorAll<HTMLAnchorElement>(`ul.navigation > li > a[href]`)];

		const forumLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Forum');
		const forumIdAndGameName = this._extractIdAndTitleFromPsnpUrl({ url: forumLink?.href });

		const trophyListLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Trophies');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: trophyListLink?.href });

		if (!hrefIdAndTitle) {
			this.addIssue({ field: 'url', selector: 'ul.navigation a', message: 'Missing trophy-list URL' });
			return null;
		}
		const [id, slug] = hrefIdAndTitle;
		const forumId = (forumIdAndGameName?.at(0) as number) || null;

		const name = doc
			.querySelector(`#banner > div.banner-overlay > div > div.title-bar.flex.v-align > div.grow > h3 > span`)
			?.nextSibling?.textContent?.trim();
		if (!name) {
			this.addIssue({ field: 'name', selector: '#banner h3 span', message: 'Missing game page title' });
			return null;
		}

		const trophyGroupsParser = new TrophyGroupsParser();
		const trophyGroups = trophyGroupsParser.parse(doc);

		const trophies = trophyGroups.flatMap(group => group.trophies);
		const trophyCount = trophiesToTrophyCount(trophies);
		const numTrophies = trophies.length;
		const points = calculateTrophyPoints(trophyCount);

		const metadata = this.parseMetadata(doc);

		const stacks: GameStackEntry[] = [];
		const sideDivHeaders = [...doc.querySelectorAll('div.col-xs-4 >  div.title.flex.v-align > div.grow > h3')];
		const stackDivHeader = sideDivHeaders.find(h3 => h3.textContent?.trim() === 'Other Platforms and Regions');
		const stackTable = stackDivHeader?.closest(`div.title.flex.v-align`)?.nextElementSibling;
		if (stackTable) {
			const gameParser = new GameStackEntryParser();
			const games = [...stackTable.querySelectorAll('tr')].map(tr => gameParser.parse(tr));
			stacks.push(...games);
		}

		let seriesIds: number[] | undefined;
		const seriesElements = [...doc.querySelectorAll<HTMLAnchorElement>('a.series-info')];
		if (seriesElements.length) {
			seriesIds = seriesElements.map(el => {
				const match = el.href.match(/series\/(\d+)/) ?? [];
				return Number.parseInt(match[1] ?? '', 10);
			});
		}

		const headerStatElements = [...doc.querySelectorAll<HTMLSpanElement>(`div.stats.flex > span.stat`)];
		const stats = this.parseHeaderStats(headerStatElements);
		if (!stats) {
			this.addIssue({
				field: 'headerStats',
				selector: 'div.stats span.stat',
				message: 'Unable to parse header stats',
			});
			return null;
		}

		const rarityBase = calculatePercent(stats.numPlatted ?? stats.num100Percented, stats.gameOwners);

		let rarityDlc: number | undefined;
		if (stats.numPlatted && stats.numPlatted !== stats.num100Percented) {
			rarityDlc = calculatePercent(stats.num100Percented, stats.gameOwners);
		}

		const platformContainer = doc.querySelector<HTMLDivElement>('div.no-top-border div.platforms');
		const platforms = platformContainer
			? [...platformContainer.querySelectorAll('span')]
					.map(span => span.textContent?.trim())
					.filter(isPlatformTag)
					.sort()
			: [];
		if (!platforms.length) {
			this.addIssue({ field: 'platforms', selector: 'div.platforms > span', message: 'Missing platform tags' });
			return null;
		}

		const stackEl = doc.querySelector('table.zebra tr > th.center');
		const stackText = stackEl?.textContent?.trim()?.replace(/\sVersion/, '') ?? '';
		const stackLabel = getStackAbbr(stackText);

		return {
			id,
			name,
			slug,
			forumId,
			platforms,
			stackLabel,
			trophyCount,
			numTrophies,
			points,
			numOwners: stats.gameOwners,
			stacks,
			stackIds: stacks.map(s => s.id),
			trophyGroups: trophyGroups,
			headerStats: stats,
			rarityBase,
			rarityDlc,
			metadata,
			seriesIds,
		};
	}

	/** Parses metadata from the trophy list. */
	protected parseMetadata(doc: Document): MetadataFields {
		const metadataRows = [...doc.querySelectorAll<HTMLTableRowElement>(`table.gameInfo tr`)].filter(
			tr => tr.cells.length > 1
		);

		const getValueOf = <IsMultiple extends boolean = false>(
			propName: string,
			multiple = false
		): IsMultiple extends true ? string[] | undefined : string | undefined => {
			const row = metadataRows.find(row => row.cells[0]?.textContent?.trim()?.includes(propName));
			if (!row) return;

			const valueString = row.cells[1]?.textContent?.trim() ?? '';
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

	protected parseHeaderStats(stats: HTMLSpanElement[]): HeaderStats | null {
		const findStat = (statName: string) => stats.find(span => span.textContent?.includes(statName));

		const gameOwners = parseNumber(findStat('Game Owner')?.firstChild);
		const recentPlayers = parseNumber(findStat('Recent Player')?.firstChild);
		const avgCompletion = parseNumber(findStat('Average Completion')?.firstChild);
		const trophiesEarned = parseNumber(findStat('Earned')?.firstChild);
		const num100Percented = parseNumber(findStat('100% Completed')?.firstChild);

		const platAchievers = parseNumber(findStat('Platinum Achiever')?.firstChild);
		const numPlatted = Number.isNaN(platAchievers) ? undefined : platAchievers;

		if ([gameOwners, recentPlayers, avgCompletion, trophiesEarned, num100Percented].some(Number.isNaN)) {
			return null;
		}

		return { gameOwners, recentPlayers, numPlatted, avgCompletion, trophiesEarned, num100Percented };
	}
}

function trophiesToTrophyCount(trophies: Trophy[], trophyCount?: TrophyCount): TrophyCount {
	const tc: TrophyCount = trophyCount ?? createEmptyTrophyCount();

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
