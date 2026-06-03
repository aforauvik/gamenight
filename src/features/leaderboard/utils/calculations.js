/**
 * Calculates individual game points based on rounds and bonuses.
 * Round 1: 5 points per correct answer
 * Round 2: 10 points per correct answer
 * Round 3: 15 points per correct answer
 */
export function calculateGamePoints(round1 = 0, round2 = 0, round3 = 0, bonus = 0) {
	return (round1 || 0) * 5 + (round2 || 0) * 10 + (round3 || 0) * 15 + (bonus || 0);
}

/**
 * Calculates all-time podium points.
 * 1st Place: 3 points
 * 2nd Place: 2 points
 * 3rd Place: 1 point
 */
export function calculatePodiumPoints(first = 0, second = 0, third = 0) {
	return (first || 0) * 3 + (second || 0) * 2 + (third || 0) * 1;
}
