import { PsnpParser } from '../psnpParser.js';
import { IGamePage, MetadataFields, HeaderStats } from '../../models/game.interface.js';
/** Parses a partial game representation from TrophyList pages. */
export declare class ParserGamePage extends PsnpParser<IGamePage, Document> {
    protected readonly type = "Game Page";
    protected _parse(doc: Document): IGamePage | null;
    /** Parses {@link MetadataFields} from the trophy list. */
    protected parseMetadata(doc: Document): MetadataFields;
    /** Parses `stats` to return {@link HeaderStats} or `null`. */
    protected parseHeaderStats(stats: HTMLSpanElement[]): HeaderStats | null;
}
//# sourceMappingURL=gamePage.d.ts.map