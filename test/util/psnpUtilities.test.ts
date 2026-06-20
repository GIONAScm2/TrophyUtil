import { describe, expect, test } from 'vitest';
import { GameListingParser, ParseError } from '../../src/parsers/index';
import {
	getPsnpPageType,
	parseNumber,
	parsePsnpDateToTimestamp,
	parsePsnpEntityUrl,
	PsnpPageType,
} from '../../src/util/index';

describe('PSNProfiles utility parsing', () => {
	test('should parse PSNProfiles entity URLs', () => {
		expect(parsePsnpEntityUrl('/trophies/2983-the-evil-within')).toEqual({
			id: 2983,
			slug: 'the-evil-within',
		});
		expect(
			parsePsnpEntityUrl('https://psnprofiles.com/trophy/2983-the-evil-within/31-it-is-what-it-is', 3)
		).toEqual({
			id: 31,
			slug: 'it-is-what-it-is',
		});
		expect(parsePsnpEntityUrl('/trophies/not-a-game')).toBeNull();
	});

	test('should detect PSNProfiles page types', () => {
		expect(getPsnpPageType(new URL('https://psnprofiles.com/games'))).toBe(PsnpPageType.Games);
		expect(getPsnpPageType(new URL('https://psnprofiles.com/trophies/2983-the-evil-within'))).toBe(
			PsnpPageType.GameTrophyList
		);
		expect(getPsnpPageType(new URL('https://psnprofiles.com/GIONAScm2'))).toBe(PsnpPageType.Profile);
	});

	test('should parse formatted numbers and UTC dates deterministically', () => {
		expect(parseNumber('5,001.5% (25.99%)')).toBe(5001.5);
		expect(parsePsnpDateToTimestamp('23rd May 2023')).toBe(Date.UTC(2023, 4, 23));
	});
});

describe('Parser diagnostics', () => {
	test('should return structured parse issues without throwing from tryParse', () => {
		const row = document.createElement('tr');
		const result = new GameListingParser().tryParse(row);

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBeInstanceOf(ParseError);
			expect(result.error.issues.map(issue => issue.field)).toEqual(['name', 'url', 'imagePath']);
		}
	});

	test('should throw ParseError from parse', () => {
		const row = document.createElement('tr');
		expect(() => new GameListingParser().parse(row)).toThrow(ParseError);
	});
});
