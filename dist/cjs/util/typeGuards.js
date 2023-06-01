"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGamePlayable = exports.isGameStandard = exports.isGameDlc = exports.isGameFromHome = exports.isGameFromStacks = exports.isPsnpEntity = void 0;
const objCompare_js_1 = require("./objCompare.js");
/** Verifies whether `entity` implements {@link IPsnpEntity} */
function isPsnpEntity(entity) {
    const keys = ['_id', 'name', '_nameSerialized', '_imagePath'];
    return (0, objCompare_js_1.isStandardObj)(entity) && keys.every(key => key in entity);
}
exports.isPsnpEntity = isPsnpEntity;
// These variables protect type predicates by throwing errors if the property names ever change.
const gameStackKeys = ['platforms', 'stackLabel'];
const gameHomeKeys = ['numTrophies', 'platforms', 'points', 'trophyCount'];
const gameDlcKeys = ['dlcName', 'groupNum', 'trophyCount', 'points', 'platforms', 'numTrophies'];
const gameStandardKeys = [...gameHomeKeys, 'numOwners', 'stackLabel'];
const gamePlayableKeys = [
    ...gameHomeKeys,
    'completionSpeed',
    'completionStatus',
    'completionRank',
    'latestTrophy',
    'percent',
    'rarityBase',
    'rarityDlc',
    'stackLabel',
];
/** Verifies whether `game` implements {@link IGamePartialTrophyList} */
function isGameFromStacks(game) {
    return isPsnpEntity(game) && gameStackKeys.every(key => key in game);
}
exports.isGameFromStacks = isGameFromStacks;
/** Verifies whether `game` implements {@link IGamePartialHome} */
function isGameFromHome(game) {
    return isPsnpEntity(game) && gameHomeKeys.every(key => key in game);
}
exports.isGameFromHome = isGameFromHome;
/** Verifies whether `game` implements {@link IGameDlc} */
function isGameDlc(game) {
    return isPsnpEntity(game) && gameDlcKeys.every(key => key in game);
}
exports.isGameDlc = isGameDlc;
/** Verifies whether `game` implements {@link IGameStandard} */
function isGameStandard(game) {
    return isPsnpEntity(game) && gameStandardKeys.every(key => key in game);
}
exports.isGameStandard = isGameStandard;
/** Verifies whether `game` implements {@link IGamePlayable} */
function isGamePlayable(game) {
    return isPsnpEntity(game) && gamePlayableKeys.every(key => key in game);
}
exports.isGamePlayable = isGamePlayable;
//# sourceMappingURL=typeGuards.js.map