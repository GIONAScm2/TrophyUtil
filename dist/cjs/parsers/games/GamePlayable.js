"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserGamePlayable = void 0;
const psnpParser_js_1 = require("../psnpParser.js");
const index_js_1 = require("../../index.js");
const trophyCount_js_1 = require("../common/trophyCount.js");
const conversions_js_1 = require("../../util/psnp/conversions.js");
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
class ParserGamePlayable extends psnpParser_js_1.PsnpParser {
    expectedEntityType = 'Playable Game';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        const rarityBaseEl = tr.querySelector(`td > span.separator.completion-status > span:first-of-type`);
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc || !rarityBaseEl) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const name = titleAnchorEl.textContent.trim();
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent).sort();
        if (!_imagePath || !name || !platforms.length) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const stackLabel = titleAnchorEl.parentElement?.querySelector('bullet')?.nextSibling?.textContent?.trim() ?? null;
        const trophyCount = (0, trophyCount_js_1.parseTrophyCount)(tr);
        const progressPercent = (0, index_js_1.parseNum)(tr.querySelector(`div.progress-bar > span`));
        const percent = Number.isNaN(progressPercent) ? undefined : progressPercent;
        const rarityBase = (0, index_js_1.parseNum)(rarityBaseEl);
        if (Number.isNaN(rarityBase) || !trophyCount) {
            return null;
        }
        const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
        const rarityDlc = rarityDlcEl ? (0, index_js_1.parseNum)(rarityDlcEl) : undefined;
        const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;
        let completionSpeed, latestTrophyTimestamp;
        const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
        if (dateHolder) {
            const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim() || '';
            completionSpeed = speedString ? (0, conversions_js_1.speedStringToMs)(speedString) : undefined;
            const day = dateHolder.childNodes[0]?.textContent?.trim();
            const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
            latestTrophyTimestamp = day && monthYear ? new Date(`${day} ${monthYear}`).valueOf() : undefined;
        }
        let completionRank;
        const completionRankEl = tr.querySelector('td .game-rank');
        if (completionRankEl) {
            completionRank = completionRankEl.textContent?.trim();
        }
        const numTrophies = (0, index_js_1.sumTrophyCount)(trophyCount);
        const points = (0, index_js_1.calculateTrophyPoints)(trophyCount);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            trophyCount,
            numTrophies,
            points,
            platforms,
            rarityBase,
            rarityDlc,
            percent,
            completionStatus,
            completionSpeed,
            completionRank,
            latestTrophy: latestTrophyTimestamp,
        };
    }
}
exports.ParserGamePlayable = ParserGamePlayable;
function isCompletionStatus(status) {
    return status === 'platinum' || status === 'completed';
}
//# sourceMappingURL=gamePlayable.js.map