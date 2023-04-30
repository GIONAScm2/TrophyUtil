import {PsnpParser} from '../PsnpParser.js';
import {IGamePlayable, PlatformTag, StackAbbrNullable, PsnpGamePlayable, parseNum} from '../../index.js';

/** Parses a 'playable' game containing user progress from Profile and Series pages. */
export class ParserGamePlayable extends PsnpParser<IGamePlayable, HTMLTableRowElement> {
	protected readonly type = 'Playable Game';

	protected _parse(tr: HTMLTableRowElement): IGamePlayable | null {
		const titleAnchorEl = tr.querySelector(`a.title`);
		const href = titleAnchorEl?.getAttribute('href');
		const hrefIdAndTitle = this._extractIdAndTitleFromPathname({pathname: href});
		const imageSrc = tr.querySelector('img[src]')?.getAttribute('src');
		const rarityBaseEl = tr.querySelector(`td > span.separator.completion-status > span:first-of-type`);

		if (!titleAnchorEl?.textContent || !hrefIdAndTitle || !imageSrc || !rarityBaseEl) {
			return null;
		}

		const _imagePath = /\w+\/\w+(?=\.[A-z]{3}$)/.exec(imageSrc)?.at(0);
		const name = titleAnchorEl.textContent.trim();
		const platforms = [...tr.querySelectorAll('span.tag.platform')].map(tag => tag.textContent) as PlatformTag[];

		if (!_imagePath || !name || !platforms.length) {
			return null;
		}

		const [_id, _nameSerialized] = hrefIdAndTitle;
		const stackLabel =
			(titleAnchorEl.parentElement
				?.querySelector('bullet')
				?.nextSibling?.textContent?.trim() as StackAbbrNullable) ?? null;

		const progressPercent = parseNum(tr.querySelector(`div.progress-bar > span`));
		const percent = Number.isNaN(progressPercent) ? null : progressPercent;

		const rarityBase = parseNum(rarityBaseEl);
		if (Number.isNaN(rarityBase)) {
			return null;
		}
		const rarityDlcEl = tr.querySelector('td > span.separator.completion-status > span:nth-of-type(2)');
		const rarityDlc = rarityDlcEl ? parseNum(rarityDlcEl) : undefined;

		const completionStatus = isCompletionStatus(tr.className) ? tr.className : undefined;

		let completionSpeed, latestTrophyTimestamp;
		const dateHolder = tr.querySelector('td > div.small-info:nth-of-type(3)');
		if (dateHolder) {
			const speedString = dateHolder.querySelector('bullet + b')?.textContent?.trim() || '';
			completionSpeed = speedString ? PsnpGamePlayable.speedStringToSeconds(speedString) : undefined;

			const day = dateHolder.childNodes[0]?.textContent?.trim();
			const monthYear = dateHolder.childNodes[2]?.textContent?.trim();
			latestTrophyTimestamp = day && monthYear ? new Date(`${day} ${monthYear}`).valueOf() : undefined;
		}

		const trophyCount = this.parseTrophyCount(tr) ?? undefined;

		console.log(_id,
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
			latestTrophyTimestamp,
			trophyCount,)
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

function isCompletionStatus(status: string): status is 'platinum' | 'completed' {
	return status === ('platinum' as const) || status === ('completed' as const);
}
