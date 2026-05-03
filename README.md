# TrophyUtil

TrophyUtil is a TypeScript library for parsing, modeling, and transforming [PSNProfiles](https://psnprofiles.com/) ("PSNP") trophy data.

It was built as a shared domain layer for a trophy-data ecosystem: browser extensions/userscripts that enhance PSNP pages, and backend scraping jobs that normalize site HTML for storage and analysis. The package keeps brittle DOM selectors and PSNP types and logic in one tested place.

## Features

- ESM-only npm package with generated TypeScript declarations and explicit subpath exports.
- Dependency-free runtime: browser callers provide the real DOM, Node callers provide a DOM implementation such as `jsdom`.
- Parsers for games, DLCs, trophy lists, trophies, and series pages.
- Strong domain types for PSNP entities, like: `GameListing`, `PlayableGame`, `GamePage`, `SeriesListing`, `SeriesPage`, `Trophy`, and `TrophyGroup`.
- Utility coverage for PSNProfiles page detection, URL parsing, trophy counts, rarity/speed conversions, UTC-safe dates, and stack labeling.
- Optional adapter types for persistence concerns such as Mongo/Mongoose document timestamps.

## Installation

```bash
npm install trophyutil
```

TrophyUtil has no runtime dependencies. If you parse HTML in Node.js, install a DOM implementation in your application:

```bash
npm install jsdom
```

## Usage

### Browser DOM

```ts
import { GameListingParser, PsnpGameBase, getPsnpPageType } from 'trophyutil';

const pageType = getPsnpPageType(new URL(window.location.href));
const nodes = PsnpGameBase.getGameNodes(pageType, window.document);

const parser = new GameListingParser();
const games = nodes.map(node => parser.parse(node));

console.log(games[0]?.id);
console.log(games[0]?.slug);
console.log(games[0]?.trophyCount);
```

### Node.js With jsdom

```ts
import { JSDOM } from 'jsdom';
import { GamePageParser } from 'trophyutil/parsers';

const html = await fetch('https://psnprofiles.com/trophies/2983-the-evil-within').then(response => response.text());
const dom = new JSDOM(html, { url: 'https://psnprofiles.com/trophies/2983-the-evil-within' });

const game = new GamePageParser().parse(dom.window.document);

console.log(game.name);
console.log(game.trophyGroups.flatMap(group => group.trophies).length);
```

### Typed Parse Results

Use the `tryParse` parsing method if you don't want to catch errors manually:

```ts
import { GameListingParser } from 'trophyutil';

const result = new GameListingParser().tryParse(row);

if (!result.ok) {
	console.error(result.error.issues);
} else {
	console.log(result.data.name);
}
```

## Package Exports

Several subpath exports are available:

```ts
import { GameListingParser } from 'trophyutil';
import type { GameListing } from 'trophyutil/models';
import { parseNumber, labelStacks } from 'trophyutil/util';
import type { GameDocument } from 'trophyutil/adapters';
```

## License

MIT
