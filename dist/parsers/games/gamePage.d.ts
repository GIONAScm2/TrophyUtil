import { PsnpParser } from '../psnpParser.js';
import { IGamePage, IMetadataFields, IHeaderStats } from '../../models/game.interface.js';
/** Parses a partial game representation from TrophyList pages. */
export declare class ParserGamePage extends PsnpParser<IGamePage, Document> {
    protected readonly expectedEntityType = "Game Page";
    protected _parse(doc: Document): IGamePage | null;
    /** Parses {@link IMetadataFields} from the trophy list. */
    protected parseMetadata(doc: Document): IMetadataFields;
    /** Parses `stats` to return {@link IHeaderStats} or `null`. */
    protected parseHeaderStats(stats: HTMLSpanElement[]): IHeaderStats | null;
}
//# sourceMappingURL=gamePage.d.ts.map