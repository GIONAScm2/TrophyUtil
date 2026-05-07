import type { GameListing, GamePage, PlayableGame } from '../models/game.interface.js';
import type { SeriesPage } from '../models/series.interface.js';

export type MongoDateField = { $date: string };

export interface MongoTimestamps {
	createdAt: MongoDateField;
	updatedAt: MongoDateField;
}

type GamePageSupplement = Pick<GamePage, 'forumId' | 'trophyGroups' | 'metadata' | 'seriesIds' | 'stackIds'>;
type GameRarity = Pick<GamePage, 'rarityBase' | 'rarityDlc'>;

/** Optional Mongo/Mongoose shape for stored game documents. */
export interface GameDocument extends GameListing, GameRarity, GamePageSupplement, Partial<MongoTimestamps> {}

/** Optional Mongo/Mongoose shape for stored user-progress game documents. */
export interface PlayableGameDocument extends GameDocument, PlayableGame {}

/** Optional Mongo/Mongoose shape for stored series documents. */
export interface SeriesDocument extends SeriesPage, Partial<MongoTimestamps> {}
