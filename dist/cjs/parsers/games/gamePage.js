"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserGamePage = void 0;
const psnpParser_js_1 = require("../psnpParser.js");
const trophyGroups_js_1 = require("../trophies/trophyGroups.js");
const gamePartialTrophyList_js_1 = require("./gamePartialTrophyList.js");
const util_js_1 = require("../../util/util.js");
/** Parses a partial game representation from TrophyList pages. */
class ParserGamePage extends psnpParser_js_1.PsnpParser {
    type = 'Game Page';
    _parse(doc) {
        const navTabs = [...doc.querySelectorAll(`ul.navigation > li > a[href]`)];
        const forumLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Forum');
        const forumIdAndGameName = this._extractIdAndTitleFromPsnpUrl({ url: forumLink?.href });
        const trophyListLink = navTabs.find(anchor => anchor.textContent?.trim() === 'Trophies');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: trophyListLink?.href });
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
        const trophyGroupsParser = new trophyGroups_js_1.ParserTrophyGroups();
        const trophyGroups = trophyGroupsParser.parse(doc);
        const metaData = this.parseMetadata(doc);
        const stacks = [];
        const sideDivHeaders = [...doc.querySelectorAll('div.col-xs-4 >  div.title.flex.v-align > div.grow > h3')];
        const stackDivHeader = sideDivHeaders.find(h3 => h3.textContent?.trim() === 'Other Platforms and Regions');
        const stackTable = stackDivHeader?.closest(`div.title.flex.v-align`)?.nextElementSibling;
        if (stackTable) {
            const gameParser = new gamePartialTrophyList_js_1.ParserGamePartialStack();
            const games = [...stackTable.querySelectorAll('tr')].map(tr => gameParser.parse(tr));
            stacks.push(...games);
        }
        const headerStatElements = [...doc.querySelectorAll(`div.stats.flex > span.stat`)];
        const completionStats = this.parseHeaderStats(headerStatElements);
        if (!completionStats) {
            return null;
        }
        const rarityBaseVerbose = ((completionStats.numPlatted ?? completionStats.num100Percented) / completionStats.gameOwners) * 100;
        const rarityBase = Math.round(rarityBaseVerbose * 100) / 100;
        let rarityDlc;
        if (completionStats.numPlatted && completionStats.numPlatted !== completionStats.num100Percented) {
            rarityDlc = Math.round((completionStats.num100Percented / completionStats.gameOwners) * 100 * 100) / 100;
        }
        const platformTags = [...doc.querySelectorAll(`div.no-top-border div.platforms > span`)];
        const platforms = platformTags.map(span => span.textContent.trim());
        if (!platforms.length) {
            return null;
        }
        const stackEl = doc.querySelector('table.zebra tr > th.center');
        const stackText = stackEl?.textContent?.trim()?.replace(/\sVersion/, '') ?? '';
        const stackLabel = (0, util_js_1.getStackAbbr)(stackText);
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
    /** Parses {@link IMetadataFields} from the trophy list. */
    parseMetadata(doc) {
        const metadataRows = [...doc.querySelectorAll(`table.gameInfo tr`)].filter(tr => tr.cells.length > 1);
        const getValueOf = (propName, multiple = false) => {
            const row = metadataRows.find(row => row.cells[0]?.textContent?.trim()?.includes(propName));
            if (!row)
                return;
            const valueString = row.cells[1].textContent?.trim() ?? '';
            if (!valueString)
                return;
            const values = valueString.split(', ').map(val => val.trim());
            if (multiple) {
                return values;
            }
            return values[0];
        };
        const metadata = {
            developer: getValueOf('Developer'),
            publisher: getValueOf('Publisher'),
            genres: getValueOf('Genres', true),
            themes: getValueOf('Themes', true),
            modes: getValueOf('Mode', true),
            otherNames: getValueOf('Other Name', true),
        };
        return metadata;
    }
    /** Parses `stats` to return {@link IHeaderStats} or `null`. */
    parseHeaderStats(stats) {
        const findStat = (statName) => stats.find(span => span.textContent?.includes(statName));
        const gameOwners = (0, util_js_1.parseNum)(findStat('Game Owners')?.firstChild);
        const recentPlayers = (0, util_js_1.parseNum)(findStat('Recent Players')?.firstChild);
        const avgCompletion = (0, util_js_1.parseNum)(findStat('Average Completion')?.firstChild);
        const trophiesEarned = (0, util_js_1.parseNum)(findStat('Trophies Earned')?.firstChild);
        const num100Percented = (0, util_js_1.parseNum)(findStat('100% Completed')?.firstChild);
        const platAchievers = (0, util_js_1.parseNum)(findStat('Platinum Achievers')?.firstChild);
        const numPlatted = Number.isNaN(platAchievers) ? undefined : platAchievers;
        return { gameOwners, recentPlayers, numPlatted, avgCompletion, trophiesEarned, num100Percented };
    }
}
exports.ParserGamePage = ParserGamePage;
//# sourceMappingURL=gamePage.js.map