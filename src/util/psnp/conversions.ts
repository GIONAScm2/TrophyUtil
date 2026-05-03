/** Converts milliseconds into the two largest PSNProfiles speed-string units. */
export function msToSpeedString(ms: number): string {
	if (!Number.isFinite(ms) || ms <= 0) {
		return '0 seconds';
	}

	let seconds = ms / 1000;
	const timeUnits = [
		{ unit: 'year', value: 31536000 },
		{ unit: 'month', value: 2626560 },
		{ unit: 'week', value: 604800 },
		{ unit: 'day', value: 86400 },
		{ unit: 'hour', value: 3600 },
		{ unit: 'minute', value: 60 },
		{ unit: 'second', value: 1 },
	];

	let speedString = '';
	let countUnits = 0;

	for (const { unit, value } of timeUnits) {
		if (seconds >= value) {
			const count = Math.floor(seconds / value);
			seconds -= value * count;
			speedString += `${count} ${unit}${count > 1 ? 's' : ''}`;

			countUnits++;
			if (countUnits === 2) break;
			if (seconds > 0) speedString += ', ';
		}
	}

	return speedString || '0 seconds';
}

/** Parses a PSNProfiles completion speed string into milliseconds. */
export function speedStringToMs(speedString: string): number {
	const timeUnits = {
		sec: 1,
		min: 60,
		hou: 3600,
		day: 86400,
		wee: 604800,
		mon: 2626560,
		yea: 31536000,
	} as const;
	type TimeUnit = keyof typeof timeUnits;

	const speeds = speedString.split(', ');
	let seconds = 0;

	for (const speed of speeds) {
		const [time, timeMetric] = speed.split(' ');
		const timeValue = Number.parseInt(time ?? '', 10);
		const timeUnit = timeMetric?.substring(0, 3) as TimeUnit | undefined;

		if (!Number.isFinite(timeValue) || !timeUnit || timeUnits[timeUnit] === undefined) {
			throw new Error(`Unable to parse speed string "${speedString}"`);
		}

		seconds += timeUnits[timeUnit] * timeValue;
	}

	return seconds * 1000;
}

const MONTHS = {
	jan: 0,
	feb: 1,
	mar: 2,
	apr: 3,
	may: 4,
	jun: 5,
	jul: 6,
	aug: 7,
	sep: 8,
	oct: 9,
	nov: 10,
	dec: 11,
} as const;

export function parsePsnpDateToTimestamp(dateText: string): number {
	const cleanedDateText = dateText
		.replace(/(\d+)(st|nd|rd|th)/gi, '$1')
		.replaceAll(',', '')
		.trim();
	const [dayText, monthText, yearText] = cleanedDateText.split(/\s+/);
	const day = Number.parseInt(dayText ?? '', 10);
	const month = MONTHS[(monthText ?? '').slice(0, 3).toLowerCase() as keyof typeof MONTHS];
	const year = Number.parseInt(yearText ?? '', 10);

	if (!Number.isSafeInteger(day) || month === undefined || !Number.isSafeInteger(year)) {
		throw new Error(`Unable to parse PSNProfiles date "${dateText}"`);
	}

	return Date.UTC(year, month, day);
}

export function parsePsnpDateTimeToTimestamp(dateText: string, timeText: string): number {
	const dateTimestamp = parsePsnpDateToTimestamp(dateText);
	const timeMatch = timeText.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
	if (!timeMatch) {
		throw new Error(`Unable to parse PSNProfiles time "${timeText}"`);
	}

	const [, hourText, minuteText, secondText = '0', meridiem] = timeMatch;
	let hour = Number.parseInt(hourText ?? '', 10);
	const minute = Number.parseInt(minuteText ?? '', 10);
	const second = Number.parseInt(secondText, 10);

	if (meridiem?.toUpperCase() === 'PM' && hour < 12) hour += 12;
	if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;

	return dateTimestamp + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;
}

/** Takes in a PSNProfiles "date played" element. */
export function timestampFromDatePlayed(element: HTMLElement): number | null {
	const textContent = element.textContent;
	if (!textContent) {
		return null;
	}

	const [dateText] = textContent.split(/(?:•|â€¢)/).map(s => s.trim());
	if (!dateText) {
		throw new Error(`Unable to parse Date Played "${textContent}" into a timestamp`);
	}

	return parsePsnpDateToTimestamp(dateText);
}
