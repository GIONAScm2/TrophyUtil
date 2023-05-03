/**
 * Given a trophy count, sums the total number of trophies.
 * @param tc A {@link TrophyCount}
 * @returns Total number of trophies
 */
export function sumTrophyCount(tc) {
    return tc.bronze + tc.silver + tc.gold + tc.platinum;
}
/**
 * Given a trophy count, calculates the total point value.
 * @param tc A {@link TrophyCount}
 * @returns Total number of points
 */ export function calculateTrophyPoints(tc) {
    return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}
//# sourceMappingURL=common.js.map