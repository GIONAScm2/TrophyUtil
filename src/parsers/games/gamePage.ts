import {PsnpParser} from '../psnpParser.js';
import {ParserTrophyGroups} from '../trophies/trophyGroups.js';
import {ParserGamePartialStack} from './gamePartialTrophyList.js';
import {
	PlatformTag,
	IGamePage,
	MetadataFields,
	IGamePartialTrophyList,
	HeaderStats,
} from '../../models/game.interface.js';
import {parseNum, getStackAbbr} from '../../util/util.js';

/** Parses a partial game representation from TrophyList pages. */
export class ParserGamePage extends PsnpParser<IGamePage, Document> {
	protected readonly type = 'Game Page';

	protected _parse(doc: Document): IGamePage | null {
		const navTabs = [...doc.querySelectorAll<HTMLAnchorElement>(`ul.navigation > li > a[href]`)];

		const forumLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Forum');
		const forumIdAndGameName = this._extractIdAndTitleFromPsnpUrl({url: forumLink?.href});

		const trophyListLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Trophies');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({url: trophyListLink?.href});

		if (!hrefIdAndTitle || !forumIdAndGameName) {
			return null;
		}
		const [_id, _nameSerialized] = hrefIdAndTitle;
		const [forumId] = forumIdAndGameName;

		const name = doc
			.querySelector(`#banner > div.banner-overlay > div > div.title-bar.flex.v-align > div.grow > h3 > span`)
			?.nextSibling?.textContent?.trim();
		if (!name) {
			return null;
		}

		const trophyGroupsParser = new ParserTrophyGroups();
		const trophyGroups = trophyGroupsParser.parse(doc);

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

		const headerStatElements = [...doc.querySelectorAll<HTMLSpanElement>(`div.stats.flex > span.stat`)];
		const completionStats = this.parseHeaderStats(headerStatElements);
		if (!completionStats) {
			return null;
		}

		const rarityBaseVerbose =
			((completionStats.numPlatted ?? completionStats.num100Percented) / completionStats.gameOwners) * 100;
		const rarityBase = Math.round(rarityBaseVerbose * 100) / 100;

		let rarityDlc: number | undefined;
		if (completionStats.numPlatted && completionStats.numPlatted !== completionStats.num100Percented) {
			rarityDlc = Math.round((completionStats.num100Percented / completionStats.gameOwners) * 100 * 100) / 100;
		}

		const platformTags = [...doc.querySelectorAll<HTMLSpanElement>(`div.no-top-border div.platforms > span`)];
		const platforms = platformTags.map(span => span.textContent!.trim() as PlatformTag);
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
			stacks,
			trophyGroups,
			completionStats,
			rarityBase,
			rarityDlc,
			metaData,
		};
	}

	/** Parses {@link MetadataFields} from the trophy list. */
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

	/** Parses `stats` to return {@link HeaderStats} or `null`. */
	protected parseHeaderStats(stats: HTMLSpanElement[]): HeaderStats | null {
		const findStat = (statName: string) => stats.find(span => span.textContent?.includes(statName));

		const gameOwners = parseNum(findStat('Game Owners')?.firstChild);
		const recentPlayers = parseNum(findStat('Recent Players')?.firstChild);
		const avgCompletion = parseNum(findStat('Average Completion')?.firstChild);
		const trophiesEarned = parseNum(findStat('Trophies Earned')?.firstChild);
		const num100Percented = parseNum(findStat('100% Completed')?.firstChild);

		const platAchievers = parseNum(findStat('Platinum Achievers')?.firstChild);
		const numPlatted = Number.isNaN(platAchievers) ? undefined : platAchievers;

		return {gameOwners, recentPlayers, numPlatted, avgCompletion, trophiesEarned, num100Percented};
	}
}
