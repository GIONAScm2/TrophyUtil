# TrophyUtil

TrophyUtil is a versatile TypeScript utility library designed to facilitate the extraction, parsing, and manipulation of key [PSNProfiles](https://psnprofiles.com/) entities like trophies, games, and game series. The library provides an extensive set of parsers and models for handling PSNP series listings, game listings, trophy listings, and more. It's designed to work seamlessly in both frontend and backend (via [jsdom](https://github.com/jsdom/jsdom)) projects, making it an isomorphic solution for PSNP data handling.

## Features

-   Parsers for PSNP data, including series listings, game listings, trophy listings, and trophy details
-   Models for representing PSNP entities such as series, games, and trophies, along with associated metadata
-   Utility functions for common tasks such as parsing numbers and manipulating object properties
-   Type safety and enhanced error handling through TypeScript annotations and mapped types
-   Support for both client-side (frontend) and server-side (backend) usage

## Installation

Install TrophyUtil using npm:

```
npm install @gionascm2/trophyutil
```

## Usage

Below is an example of how to use the `PsnpSeriesListingParser` and `PsnpSeriesListing` classes from TrophyUtil:

```typescript
import {PsnpSeriesListingParser, PsnpSeriesListing} from '@gionascm2/trophyutil';

// HTML content of a PSNP series listings page
const seriesListingsPageHtml = '...';

// Create an instance of the parser
const parser = new PsnpSeriesListingParser();

// Parse the series listings from the HTML content
const seriesListings = parser.parse(seriesListingsPageHtml);

// Iterate through the parsed series listings
seriesListings.forEach(series => {
	// Create an instance of PsnpSeriesListing
	const psnpSeriesListing = new PsnpSeriesListing(series);

	// Access properties of the series listing
	console.log(psnpSeriesListing.id);
	console.log(psnpSeriesListing.name);
	console.log(psnpSeriesListing.numGames);
});
```

For more detailed examples and usage instructions, please refer to the individual classes and functions within the TrophyUtil library.

## Contributing

Contributions are welcome! Submit a pull request or create an issue to contribute to this project.

## License

This project is licensed under the MIT License - see `COPYING.txt` for details.
