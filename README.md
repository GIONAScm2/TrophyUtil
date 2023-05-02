# TrophyUtil

TrophyUtil is a versatile utility library designed for parsing, modelling, and manipulating core [PSNProfiles](https://psnprofiles.com/) (PSNP) entities like trophies, games, and game series.

## Features

-   Isomorphic, working seamlessly in both frontend and backend (via [jsdom](https://github.com/jsdom/jsdom)) projects.
-   Compatible with both CommonJS and ESM.
-   HTML parsers for core PSNP entities like trophies, games, and game series.
-   Richly-annotated interfaces and classes that provide helpful methods, like transforming a completion time into a timestamp and vice versa.
-   Additional interfaces for MongoDB/Mongoose provide smoother database integration with properties like `createdAt` and `updatedAt`.
-   Specialized utility functions for trophy-specific use cases like parsing formatted numbers and checking for relative equality between entities.

## Installation

Install TrophyUtil using npm:

```
npm install trophyutil
```

## Usage

Below is an example of how to use the `PsnpSeriesListingParser` and `PsnpSeriesListing` classes from TrophyUtil:

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

## Contributing

Contributions are welcome! Submit a pull request or create an issue to contribute to this project.

## License

This project is licensed under the GPLv3 License - see `COPYING.txt` for details.
