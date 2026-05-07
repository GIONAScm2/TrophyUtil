import type { TrophyCount } from '../../models/common.js';
import { parseNumber } from '../../util/util.js';

export function parseTrophyCount(tr: HTMLTableRowElement, isHomeOrGameSearch = false): TrophyCount | null {
	const suffix = isHomeOrGameSearch ? '.icon-sprite' : '.icon-sprite + span';

	const bronze = parseNumber(tr.querySelector(`.bronze${suffix}`));
	const silver = parseNumber(tr.querySelector(`.silver${suffix}`));
	const gold = parseNumber(tr.querySelector(`.gold${suffix}`));
	if (Number.isNaN(bronze + silver + gold)) {
		return null;
	}

	let platCount = 0;
	const platNode = tr.querySelector('[class*="platinum"]');
	if (platNode) {
		// Profile/Series
		if (tr.querySelector('.platinum-18')) {
			platCount = tr.querySelector('.platinum-18.earned') ? 1 : 0;
		}
		// Standard
		else platCount = parseNumber(tr.querySelector(`.platinum${suffix}`));
	}
	platCount = Number.isNaN(platCount) ? 0 : platCount;
	return { bronze, silver, gold, platinum: platCount };
}
