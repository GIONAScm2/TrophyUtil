# TrophyUtil

TrophyUtil is a published TypeScript library for parsing, modelling, and transforming core [PSNProfiles](https://psnprofiles.com/) (PSNP) entities such as trophies, games, and game series.

It was built as a shared domain layer for a larger trophy-data ecosystem, powering both browser-side features and backend scraping jobs. The package focuses on turning brittle site HTML into reusable, strongly-typed application models.

## What It Does

- Parses PSNProfiles HTML into typed trophy, game, and series entities.
- Provides reusable classes and interfaces for working with parsed data across frontend and backend codebases.
- Supports browser and server environments, including [jsdom](https://github.com/jsdom/jsdom)-based scraping workflows.
- Includes helper utilities for entity diffing, page-type detection, formatted number parsing, and trophy-specific transformations.
- Exposes document shapes that map cleanly into MongoDB / Mongoose persistence layers.

## Features

-   Isomorphic, working in both frontend and backend environments.
-   ESM-first (`import`) package with bundled TypeScript declarations.
-   Parsers for core PSNP entities including trophies, games, DLC listings, profiles, and series.
-   Domain models with computed helpers for trophy counts, completion speed, rarity, URLs, and other derived values.
-   Utilities for comparing parsed entities against stored records and applying targeted updates.
-   Fixture-driven test coverage for parsers and domain models.

## Used In

- Browser userscripts that augment PSNProfiles pages with richer tables, caching, and workflow helpers.
- Backend scraping services that fetch PSNP pages, normalize the data, and persist it to MongoDB.

## Installation

Install TrophyUtil using npm:

```
npm install trophyutil
```

## Usage

Here is a simple example that parses standard game rows from a PSNP page:

```typescript
import {getPsnpPageType, PsnpGameStandard, ParserGameStandard} from 'trophyutil';

// Select nodes based on page type
const pageType = getPsnpPageType(window.location);
const gameNodes = PsnpGameStandard.getGameNodes(pageType, window.document);

// Parse nodes into richly-interfaced data
const parser = new ParserGameStandard();
const gameData = gameNodes.map(node => parser.parse(node));
const speed = gameData[0].completionSpeed; // 3661

// Classes wrap data with utility methods
const games = gameData.map(data => new PsnpGameStandard(data));
const speedString = PsnpGameStandard.secondsToSpeedString(speed); // "1 hour, 1 minute"
```

## Design Goals

-   Keep site-specific parsing logic in one place instead of scattering selectors across multiple apps.
-   Share a consistent set of domain types between scraping, persistence, and UI layers.
-   Make HTML ingestion safer by validating and normalizing the most important entity fields early.

## Contributing

Contributions are welcome! Submit a pull request or create an issue to contribute to this project.

## License

This project is licensed under the GPLv3 License - see `COPYING.txt` for details.
