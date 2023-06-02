/** Converts `ms` into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
 *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
export function msToSpeedString(ms: number): string {
	if (ms === 0) {
		return '0 seconds';
	}

	let seconds = ms / 1000;

	const timeUnits = [
		{unit: 'year', value: 31536000},
		{unit: 'month', value: 2626560}, // seconds in 30.4 days
		{unit: 'week', value: 604800},
		{unit: 'day', value: 86400},
		{unit: 'hour', value: 3600},
		{unit: 'minute', value: 60},
		{unit: 'second', value: 1},
	];

	let speedString = '';
	let countUnits = 0;

	for (const {unit, value} of timeUnits) {
		if (seconds >= value) {
			const count = Math.floor(seconds / value);
			seconds -= value * count;
			speedString += `${count} ${unit}${count > 1 ? 's' : ''}`;

			countUnits++;
			if (countUnits === 2) {
				break;
			}

			if (seconds > 0) {
				speedString += ', ';
			}
		}
	}

	return speedString;
}

/** Parses a Fastest Achiever's speed into ms. `speedString` is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
export function speedStringToMs(speedString: string): number {
	type TimeUnit = keyof typeof timeUnits;
	const timeUnits = {
		sec: 1,
		min: 60,
		hou: 3600,
		day: 86400,
		wee: 604800,
		mon: 2626560, // PSNP calculates a month as 30.4 days (https://forum.psnprofiles.com/topic/61709-bug-in-calculating-time-between-trophies/)
		yea: 31536000,
	} as const;

	const speeds = speedString.split(', ');
	let seconds = 0;

	for (const speed of speeds) {
		const [time, timeMetric] = speed.split(' ');
		const timeValue = parseInt(time!, 10);
		const timeUnit = timeMetric!.substring(0, 3) as TimeUnit;

		seconds += timeUnits[timeUnit] * timeValue;
	}
	return seconds * 1000;
}

/** Takes in a 'date played' element: \<div class="small-info" [...] */
export function timestampFromDatePlayed(element: HTMLElement): number | null {
	const textContent = element.textContent;
	if (!textContent) {
		return null;
	}

	const [dateText] = textContent.split('•').map(s => s.trim());
	if (!dateText) {
		throw new Error(`Unable to parse Date Played "${textContent}" into a timestamp`);
	}
	const cleanedDateText = dateText.replace(/(\d+)(st|nd|rd|th)/, '$1').trim();

	return new Date(cleanedDateText).valueOf();
}
