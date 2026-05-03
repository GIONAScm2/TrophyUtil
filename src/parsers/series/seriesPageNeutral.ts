import { type TrophyCount, calculateTrophyPoints, sumTrophyCount } from '../../models/common.js';
import type { SeriesPage, Stage } from '../../models/series.interface.js';
import type { WindowLike } from '../../util/browserContext.js';
import { PlayableGameParser } from '../games/gamePlayable.js';
import { PsnpParser } from '../psnpParser.js';

export class SeriesPageParser extends PsnpParser<SeriesPage, WindowLike> {
	protected readonly expectedEntityType = 'Series Page';

	protected _parse(_window: WindowLike): SeriesPage | null {
		const name = _window.document.querySelector(`div.series-info div.ellipsis > span`)?.textContent?.trim();
		const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: _window.location.pathname });
		const imageSrc = _window.document.querySelector('div.series-info picture img[src]')?.getAttribute('src');

		if (!name || !hrefIdAndTitle || !imageSrc) {
			return null;
		}

		const [id, slug] = hrefIdAndTitle;
		const imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);

		const gameParser = new PlayableGameParser();
		const stageElements = [..._window.document.querySelectorAll<HTMLTableElement>(`table.box.zebra.series`)];
		const stages: Stage[] = stageElements.map(el => {
			const stageNumString =
				el.querySelector(`tr:first-of-type > td:first-of-type span.typo-top`)?.textContent?.trim() ?? '';
			const stageNum = stageNumString === 'NO' ? 0 : Number.parseInt(stageNumString, 10);

			const games = [...el.querySelectorAll('tr')].map(tr => gameParser.parse(tr));
			const gameIds = games.map(g => g.id);

			return { stageNum, gameIds, games };
		});
		const trophyCount = aggregateSeriesTrophyCount(stages);

		if (!imagePath || !stages.length || !trophyCount) {
			return null;
		}

		const points = calculateTrophyPoints(trophyCount);
		const numTrophies = sumTrophyCount(trophyCount);
		const numGames = stages.reduce((acc, stage) => acc + stage.gameIds.length, 0);

		return {
			id,
			slug,
			name,
			imagePath,
			stages,
			trophyCount,
			points,
			numTrophies,
			numGames,
		};
	}
}

function aggregateSeriesTrophyCount(stages: Stage[]): TrophyCount | undefined {
	const aggregateTrophyCount: TrophyCount = {
		bronze: 0,
		silver: 0,
		gold: 0,
		platinum: 0,
	};

	for (const stage of stages) {
		if (stage.games)
			for (const game of stage.games) {
				if (game.trophyCount) {
					aggregateTrophyCount.bronze += game.trophyCount.bronze;
					aggregateTrophyCount.silver += game.trophyCount.silver;
					aggregateTrophyCount.gold += game.trophyCount.gold;
					aggregateTrophyCount.platinum += game.trophyCount.platinum;
				} else {
					return;
				}
			}
	}
	return aggregateTrophyCount;
}
