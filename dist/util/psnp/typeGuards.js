import { isStandardObj } from '../objCompare.js';
/** Verifies whether `entity` implements {@link IPsnpEntity} */
export function isPsnpEntity(entity) {
    const keys = ['_id', 'name', '_nameSerialized', '_imagePath'];
    return isStandardObj(entity) && keys.every(key => key in entity);
}
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
export function isGameFromStacks(game) {
    return isPsnpEntity(game) && gameStackKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGamePartialHome} */
export function isGameFromHome(game) {
    return isPsnpEntity(game) && gameHomeKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGameDlc} */
export function isGameDlc(game) {
    return isPsnpEntity(game) && gameDlcKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGameStandard} */
export function isGameStandard(game) {
    return isPsnpEntity(game) && gameStandardKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGamePlayable} */
export function isGamePlayable(game) {
    return isPsnpEntity(game) && gamePlayableKeys.every(key => key in game);
}
//# sourceMappingURL=typeGuards.js.map