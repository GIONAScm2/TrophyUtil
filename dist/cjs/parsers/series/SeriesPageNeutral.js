"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserSeriesPageNeutral = void 0;
const index_js_1 = require("../../index.js");
const psnpParser_js_1 = require("../psnpParser.js");
class ParserSeriesPageNeutral extends psnpParser_js_1.PsnpParser {
    type = 'Series Page';
    _parse(_window) {
        const name = _window.document.querySelector(`div.series-info div.ellipsis > span`)?.textContent?.trim();
        const hrefIdAndTitle = this._extractIdAndTitleFromPsnpUrl({ url: _window.location.pathname });
        const imageSrc = _window.document.querySelector('div.series-info picture img[src]')?.getAttribute('src');
        if (!name || !hrefIdAndTitle || !imageSrc) {
            return null;
        }
        const [_id, _nameSerialized] = hrefIdAndTitle;
        const _imagePath = /\/series\/(.+?)\.S\.png/.exec(imageSrc)?.at(1);
        const gameParser = new index_js_1.ParserGamePlayable();
        const stageElements = [..._window.document.querySelectorAll(`table.box.zebra.series`)];
        const stages = stageElements.map(el => {
            const stageNumString = el.querySelector(`tr:first-of-type > td:first-of-type span.typo-top`)?.textContent?.trim() ?? '';
            const stageNum = stageNumString === 'NO' ? 0 : +stageNumString;
            const games = [...el.querySelectorAll('tr')].map(tr => gameParser.parse(tr));
            return { stageNum, games };
        });
        const trophyCount = aggregateSeriesTrophyCount(stages);
        if (!_imagePath || !stages.length || !trophyCount) {
            return null;
        }
        const points = (0, index_js_1.calculateTrophyPoints)(trophyCount);
        const numTrophies = (0, index_js_1.sumTrophyCount)(trophyCount);
        const numGames = stages.reduce((acc, stage) => acc + stage.games.length, 0);
        return {
            _id,
            _nameSerialized,
            name,
            _imagePath,
            stages,
            trophyCount,
            points,
            numTrophies,
            numGames,
        };
    }
}
exports.ParserSeriesPageNeutral = ParserSeriesPageNeutral;
function aggregateSeriesTrophyCount(stages) {
    const aggregateTrophyCount = {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
    };
    for (const stage of stages) {
        for (const game of stage.games) {
            if (game.trophyCount) {
                aggregateTrophyCount.bronze += game.trophyCount.bronze;
                aggregateTrophyCount.silver += game.trophyCount.silver;
                aggregateTrophyCount.gold += game.trophyCount.gold;
                aggregateTrophyCount.platinum += game.trophyCount.platinum;
            }
            else {
                return;
            }
        }
    }
    return aggregateTrophyCount;
}
//# sourceMappingURL=seriesPageNeutral.js.map