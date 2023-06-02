/** Converts `ms` into a PSNP speedString of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`.
 *  The largest metrics are always used (EG: `2 years, 1 month`, even if it omits an additional 3 weeks). */
export declare function msToSpeedString(ms: number): string;
/** Parses a Fastest Achiever's speed into ms. `speedString` is always of the form `<num> <timeMetric>(s), <num> <timeMetric>(s)`. */
export declare function speedStringToMs(speedString: string): number;
/** Takes in a 'date played' element: \<div class="small-info" [...] */
export declare function timestampFromDatePlayed(element: HTMLElement): number | null;
//# sourceMappingURL=conversions.d.ts.map