"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpPlayableGameParser = void 0;
const psnpGameParser_js_1 = require("./psnpGameParser.js");
const index_js_1 = require("../../index.js");
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
class PsnpPlayableGameParser extends psnpGameParser_js_1.PsnpGameParser {
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromHref(href);
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        const rarityBaseEl = tr.querySelector(`td > span.separator.completion-status > span:first-of-type`);
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc || !rarityBaseEl) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        if (!_imagePath) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const name = titleAnchorEl.textContent.trim();
        const stackLabel = titleAnchorEl.parentElement
            ?.querySelector('bullet')
            ?.nextSibling?.textContent?.trim() ?? null;
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent);
        const progressBar = tr.querySelector(`div.progress-bar > span`);
        const percent = progressBar ? (0, index_js_1.parseNum)(progressBar) : null;
        const rarityBase = (0, index_js_1.parseNum)(rarityBaseEl);
        const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
        const rarityDlc = rarityDlcEl ? (0, index_js_1.parseNum)(rarityDlcEl) : undefined;
        const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;
        let completionSpeed, latestTrophyTimestamp;
        const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
        if (dateHolder) {
            const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim();
            completionSpeed = speedString ? index_js_1.PsnpGamePlayable.speedStringToSeconds(speedString) : null;
            const day = dateHolder.childNodes[0]?.textContent?.trim();
            const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
            latestTrophyTimestamp = day && monthYear ? new Date(`${day} ${monthYear}`).valueOf() : undefined;
        }
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            platforms,
            percent,
            rarityBase,
            rarityDlc,
            completionStatus,
            completionSpeed,
            latestTrophy: latestTrophyTimestamp,
        };
    }
}
exports.PsnpPlayableGameParser = PsnpPlayableGameParser;
function isCompletionStatus(status) {
    return status === 'platinum' || status === 'completed';
}
//# sourceMappingURL=psnpPlayableGameParser.js.map