import { PsnpParser } from '../psnpParser.js';
import { calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import type { CompletionStatus, PlayableGame } from '../../models/game.interface.js';
import { parseTrophyCount } from '../common/trophyCount.js';
import { parsePsnpDateToTimestamp, speedStringToMs } from '../../util/psnp/conversions.js';
import { isStackAbbr, parseNumber, parsePlatformTags } from '../../util/util.js';

/** Parses a playable game containing user progress from Profile and Series pages. */
export class PlayableGameParser extends PsnpParser<PlayableGame, HTMLTableRowElement> {
	protected readonly expectedEntityType = 'Playable Game';

	protected _parse(tr: HTMLTableRowElement): PlayableGame | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: href });
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
		const rarityBaseEl = tr.querySelector(`td > span.separator.completion-status > span:first-of-type`);

		if (!titleAnchorEl?.textContent)
			this.addIssue({ field: 'name', selector: 'a.title', message: 'Missing game title' });
		if (!hrefIdAndTitle)
			this.addIssue({ field: 'url', selector: 'a.title[href]', message: 'Missing or invalid game URL' });
		if (!imageSrc) this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Missing game image' });
		if (!rarityBaseEl)
			this.addIssue({ field: 'rarityBase', selector: 'span.completion-status', message: 'Missing rarity' });
		if (this.hasIssues()) {
			return null;
		}
		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc || !rarityBaseEl) {
			return null;
		}

		const imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const name = titleAnchorEl.textContent.trim();
		const platforms = parsePlatformTags(tr);

		if (!imagePath)
			this.addIssue({ field: 'imagePath', selector: 'img[src]', message: 'Unable to extract image path' });
		if (!name) this.addIssue({ field: 'name', selector: 'a.title', message: 'Missing game title text' });
		if (!platforms.length)
			this.addIssue({ field: 'platforms', selector: 'span.tag.platform', message: 'Missing platform tags' });
		if (this.hasIssues() || !imagePath) {
			return null;
		}

		const [id, slug] = hrefIdAndTitle;
		const stackLabelText = titleAnchorEl.parentElement?.querySelector('bullet')?.nextSibling?.textContent?.trim();
		const stackLabel = isStackAbbr(stackLabelText) ? stackLabelText : null;

		const trophyCount = parseTrophyCount(tr);

		const progressPercent = parseNumber(tr.querySelector(`div.progress-bar > span`));
		const percent = Number.isNaN(progressPercent) ? undefined : progressPercent;

		const rarityBase = parseNumber(rarityBaseEl);
		if (Number.isNaN(rarityBase) || !trophyCount) {
			if (Number.isNaN(rarityBase)) this.addIssue({ field: 'rarityBase', message: 'Unable to parse rarity' });
			if (!trophyCount) this.addIssue({ field: 'trophyCount', message: 'Unable to parse trophy count' });
			return null;
		}
		const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
		const rarityDlc = rarityDlcEl ? parseNumber(rarityDlcEl) : undefined;

		const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;

		let completionSpeed, latestTrophyTimestamp;
		const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
		if (dateHolder) {
			const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim() || '';
			completionSpeed = speedString ? speedStringToMs(speedString) : undefined;

			const day = dateHolder.childNodes[0]?.textContent?.trim();
			const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
			latestTrophyTimestamp = day && monthYear ? parsePsnpDateToTimestamp(`${day} ${monthYear}`) : undefined;
		}

		let completionRank: string | undefined;
		const completionRankEl = tr.querySelector('td .game-rank');
		if (completionRankEl) {
			completionRank = completionRankEl.textContent?.trim();
		}

		const numTrophies = sumTrophyCount(trophyCount);
		const points = calculateTrophyPoints(trophyCount);

		return {
			id,
			slug,
			name,
			imagePath,
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

function isCompletionStatus(status: string): status is CompletionStatus {
	return status === 'platinum' || status === 'completed';
}
