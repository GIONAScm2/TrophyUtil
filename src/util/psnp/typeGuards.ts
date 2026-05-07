import { isStandardObj } from '../objCompare.js';
import type { PsnpEntityData } from '../../models/psnpEntity.js';
import type {
	GameStackEntry,
	GameHomeListing,
	GameListing,
	PlayableGame,
	GameDlc,
} from '../../models/game.interface.js';

export function isPsnpEntity(entity: unknown): entity is PsnpEntityData {
	const keys = ['id', 'name', 'slug', 'imagePath'] satisfies Array<keyof PsnpEntityData>;
	return isStandardObj(entity) && keys.every(key => key in entity);
}

// These variables protect type predicates by throwing errors if the property names ever change.
const gameStackKeys = ['platforms', 'stackLabel'] satisfies Array<keyof GameStackEntry>;
const gameHomeKeys = ['numTrophies', 'platforms', 'points', 'trophyCount'] satisfies Array<keyof GameHomeListing>;
const gameDlcKeys = ['dlcName', 'groupNum', 'trophyCount', 'points', 'platforms', 'numTrophies'] satisfies Array<
	keyof GameDlc
>;
const gameListingKeys = [...gameHomeKeys, 'numOwners', 'stackLabel'] satisfies Array<keyof GameListing>;
const playableGameKeys = [...gameHomeKeys, 'rarityBase', 'stackLabel'] satisfies Array<keyof PlayableGame>;

export function isGameStackEntry(game: unknown): game is GameStackEntry {
	return isPsnpEntity(game) && gameStackKeys.every(key => key in game);
}

export function isGameHomeListing(game: unknown): game is GameHomeListing {
	return isPsnpEntity(game) && gameHomeKeys.every(key => key in game);
}

export function isGameDlc(game: unknown): game is GameDlc {
	return isPsnpEntity(game) && gameDlcKeys.every(key => key in game);
}

export function isGameListing(game: unknown): game is GameListing {
	return isPsnpEntity(game) && gameListingKeys.every(key => key in game);
}

export function isPlayableGame(game: unknown): game is PlayableGame {
	return isPsnpEntity(game) && playableGameKeys.every(key => key in game);
}
