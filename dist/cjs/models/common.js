"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTrophyPoints = exports.sumTrophyCount = void 0;
/**
 * Given a trophy count, sums the total number of trophies.
 * @param tc A {@link TrophyCount}
 * @returns Total number of trophies
 */
function sumTrophyCount(tc) {
    return tc.bronze + tc.silver + tc.gold + tc.platinum;
}
exports.sumTrophyCount = sumTrophyCount;
/**
 * Given a trophy count, calculates the total point value.
 * @param tc A {@link TrophyCount}
 * @returns Total number of points
 */ function calculateTrophyPoints(tc) {
    return tc.bronze * 15 + tc.silver * 30 + tc.gold * 90 + tc.platinum * 300;
}
exports.calculateTrophyPoints = calculateTrophyPoints;
//# sourceMappingURL=common.js.map