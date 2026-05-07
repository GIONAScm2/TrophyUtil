import { parsePsnpDateTimeToTimestamp } from '../util/psnp/conversions.js';
import type { Trophy, TrophyGrade } from './trophy.interface.js';

export class PsnpTrophy implements Trophy {
	id: number;
	name: string;
	desc: string;
	grade: TrophyGrade;
	rarity: number;
	slug: string;
	imagePath: string;
	dateEarned?: number | undefined;

	constructor(trophy: Trophy) {
		this.id = trophy.id;
		this.name = trophy.name;
		this.desc = trophy.desc;
		this.grade = trophy.grade;
		this.rarity = trophy.rarity;
		this.slug = trophy.slug;
		this.imagePath = trophy.imagePath;
		this.dateEarned = trophy.dateEarned;
	}

	get urlPath(): string {
		return `${this.id}-${this.slug}`;
	}
	get src(): string {
		return `trophies/${this.imagePath}.png`;
	}
	get rarityString(): string {
		return this.rarity.toFixed(2);
	}

	getElement(doc: Document): HTMLTableRowElement | null {
		const tableRow = doc.querySelector(`#content a[href*="/${this.urlPath}"]`)?.closest('tr');
		return tableRow ?? null;
	}

	/** Parses a trophy element's earned date into a UTC timestamp in milliseconds. */
	static timestampFromDateEarned(element: HTMLElement): number {
		const dateAndTimeNodes = [
			...element.querySelectorAll(`td:nth-of-type(3) :is(.typo-top-date, .typo-bottom-date) > nobr`),
		];
		const [dateEl, timeEl] = dateAndTimeNodes;

		return parsePsnpDateTimeToTimestamp(dateEl?.textContent ?? '', timeEl?.textContent ?? '');
	}
}
