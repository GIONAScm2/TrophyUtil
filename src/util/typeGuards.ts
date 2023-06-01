import {isStandardObj} from './objCompare';
import {IPsnpEntity} from '../models/psnpEntity';
import {IGamePartialTrophyList, IGamePartialHome, IGameStandard, IGamePlayable, IGameDlc} from '../models/game.interface';

/** Verifies whether `entity` implements {@link IPsnpEntity} */
export function isPsnpEntity(entity: unknown): entity is IPsnpEntity {
	const keys: (keyof IPsnpEntity)[] = ['_id', 'name', '_nameSerialized', '_imagePath'];
	return isStandardObj(entity) && keys.every(key => key in entity);
}

// These variables protect type predicates by throwing errors if the property names ever change.
const gameStackKeys: (keyof IGamePartialTrophyList)[] = ['platforms', 'stackLabel'];
const gameHomeKeys: (keyof IGamePartialHome)[] = ['numTrophies', 'platforms', 'points', 'trophyCount'];
const gameDlcKeys: (keyof IGameDlc)[] = ['dlcName', 'groupNum', 'trophyCount', 'points', 'platforms', 'numTrophies'];
const gameStandardKeys: (keyof IGameStandard)[] = [...gameHomeKeys, 'numOwners', 'stackLabel'];
const gamePlayableKeys: (keyof IGamePlayable)[] = [
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
export function isGameFromStacks(game: unknown): game is IGamePartialTrophyList {
	return isPsnpEntity(game) && gameStackKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGamePartialHome} */
export function isGameFromHome(game: unknown): game is IGamePartialHome {
	return isPsnpEntity(game) && gameHomeKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGameDlc} */
export function isGameDlc(game: unknown): game is IGameDlc {
	return isPsnpEntity(game) && gameDlcKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGameStandard} */
export function isGameStandard(game: unknown): game is IGameStandard {
	return isPsnpEntity(game) && gameStandardKeys.every(key => key in game);
}
/** Verifies whether `game` implements {@link IGamePlayable} */
export function isGamePlayable(game: unknown): game is IGamePlayable {
	return isPsnpEntity(game) && gamePlayableKeys.every(key => key in game);
}
