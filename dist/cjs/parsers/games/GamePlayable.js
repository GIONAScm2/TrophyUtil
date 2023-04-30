"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserGamePlayable = void 0;
const PsnpParser_js_1 = require("../PsnpParser.js");
const index_js_1 = require("../../index.js");
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
class ParserGamePlayable extends PsnpParser_js_1.PsnpParser {
    type = 'Playable Game';
    _parse(tr) {
        const titleAnchorEl = tr.querySelector(`a.title`);
        const href = titleAnchorEl?.getAttribute('href');
        const hrefIdAndTitle = this._extractIdAndTitleFromPathname({ pathname: href });
        const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
        const rarityBaseEl = tr.querySelector(`td > span.separator.completion-status > span:first-of-type`);
        if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc || !rarityBaseEl) {
            return null;
        }
        const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
        const name = titleAnchorEl.textContent.trim();
        const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent);
        if (!_imagePath || !name || !platforms.length) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const stackLabel = titleAnchorEl.parentElement
            ?.querySelector('bullet')
            ?.nextSibling?.textContent?.trim() ?? null;
        const progressPercent = (0, index_js_1.parseNum)(tr.querySelector(`div.progress-bar > span`));
        const percent = Number.isNaN(progressPercent) ? null : progressPercent;
        const rarityBase = (0, index_js_1.parseNum)(rarityBaseEl);
        if (Number.isNaN(rarityBase)) {
            return null;
        }
        const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
        const rarityDlc = rarityDlcEl ? (0, index_js_1.parseNum)(rarityDlcEl) : undefined;
        const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;
        let completionSpeed, latestTrophyTimestamp;
        const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
        if (dateHolder) {
            const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim() || '';
            completionSpeed = speedString ? index_js_1.PsnpGamePlayable.speedStringToSeconds(speedString) : undefined;
            const day = dateHolder.childNodes[0]?.textContent?.trim();
            const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
            latestTrophyTimestamp = day && monthYear ? new Date(`${day} ${monthYear}`).valueOf() : undefined;
        }
        const trophyCount = this.parseTrophyCount(tr) ?? undefined;
        console.log(_id, _nameSerialized, name, _imagePath, stackLabel, platforms, rarityBase, rarityDlc, percent, completionStatus, completionSpeed, latestTrophyTimestamp, trophyCount);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stackLabel,
            platforms,
            rarityBase,
            rarityDlc,
            percent,
            completionStatus,
            completionSpeed,
            latestTrophy: latestTrophyTimestamp,
            trophyCount,
        };
    }
}
exports.ParserGamePlayable = ParserGamePlayable;
function isCompletionStatus(status) {
    return status === 'platinum' || status === 'completed';
}
//# sourceMappingURL=gamePlayable.js.map