import { PsnpParser } from '../PsnpParser.js';
import { PsnpGamePlayable, parseNum } from '../../index.js';
/** Parses a 'playable' game containing user progress from Profile and Series pages. */
export class ParserGamePlayable extends PsnpParser {
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
        const percent = progressBar ? parseNum(progressBar) : null;
        const rarityBase = parseNum(rarityBaseEl);
        const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
        const rarityDlc = rarityDlcEl ? parseNum(rarityDlcEl) : undefined;
        const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;
        let completionSpeed, latestTrophyTimestamp;
        const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
        if (dateHolder) {
            const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim();
            completionSpeed = speedString ? PsnpGamePlayable.speedStringToSeconds(speedString) : null;
            const day = dateHolder.childNodes[0]?.textContent?.trim();
            const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
            latestTrophyTimestamp = day && monthYear ? new Date(`${day} ${monthYear}`).valueOf() : undefined;
        }
        const trophyCount = this.parseTrophyCount(tr) ?? undefined;
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
function isCompletionStatus(status) {
    return status === 'platinum' || status === 'completed';
}
//# sourceMappingURL=gamePlayable.js.map