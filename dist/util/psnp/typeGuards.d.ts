import { IPsnpEntity } from '../../models/psnpEntity.js';
import { IGamePartialTrophyList, IGamePartialHome, IGameStandard, IGamePlayable, IGameDlc } from '../../models/game.interface.js';
/** Verifies whether `entity` implements {@link IPsnpEntity} */
export declare function isPsnpEntity(entity: unknown): entity is IPsnpEntity;
/** Verifies whether `game` implements {@link IGamePartialTrophyList} */
export declare function isGameFromStacks(game: unknown): game is IGamePartialTrophyList;
/** Verifies whether `game` implements {@link IGamePartialHome} */
export declare function isGameFromHome(game: unknown): game is IGamePartialHome;
/** Verifies whether `game` implements {@link IGameDlc} */
export declare function isGameDlc(game: unknown): game is IGameDlc;
/** Verifies whether `game` implements {@link IGameStandard} */
export declare function isGameStandard(game: unknown): game is IGameStandard;
/** Verifies whether `game` implements {@link IGamePlayable} */
export declare function isGamePlayable(game: unknown): game is IGamePlayable;
//# sourceMappingURL=typeGuards.d.ts.map