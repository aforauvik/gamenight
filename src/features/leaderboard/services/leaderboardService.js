import { supabase } from "@/lib/supabase";
import { calculateGamePoints, calculatePodiumPoints } from "../utils/calculations";

/**
 * Fetches completed games and maps them to show the winners and their scores.
 */
export async function getGameHistory(seasonYear) {
	let query = supabase
		.from("games")
		.select(`
			id,
			created_at,
			topic,
			season,
			game_scores (
				round_1_score,
				round_2_score,
				round_3_score,
				bonus_score,
				podium_finish,
				players (
					name,
					avatar_url
				)
			)
		`)
		.eq("status", "completed")
		.not("topic", "ilike", "Podium%");

	if (seasonYear) {
		query = query
			.gte("created_at", `${seasonYear}-01-01T00:00:00Z`)
			.lte("created_at", `${seasonYear}-12-31T23:59:59Z`);
	}

	const { data, error } = await query.order("created_at", { ascending: false });
	if (error) {
		console.error("Error fetching game history:", error);
		return [];
	}

	return data.map((game) => {
		const winnerScore = game.game_scores?.find((score) => score.podium_finish === 1);
		const r1 = winnerScore?.round_1_score || 0;
		const r2 = winnerScore?.round_2_score || 0;
		const r3 = winnerScore?.round_3_score || 0;
		const bonus = winnerScore?.bonus_score || 0;

		return {
			date: new Date(game.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "2-digit",
				year: "numeric",
			}),
			name: winnerScore?.players?.name || "Unknown",
			topic: game.topic,
			avatar: winnerScore?.players?.avatar_url || "",
			round1: r1,
			round2: r2,
			round3: r3,
			bonus: bonus,
			points: calculateGamePoints(r1, r2, r3, bonus),
		};
	});
}

/**
 * Aggregates player standings based on podium finishes (1st, 2nd, 3rd) across completed games.
 */
export async function getSeasonStandings(seasonYear) {
	const { data, error } = await supabase
		.from("players")
		.select(`
			id,
			name,
			avatar_url,
			game_scores (
				podium_finish,
				games!inner (
					season,
					status,
					created_at
				)
			)
		`)
		.eq("game_scores.games.status", "completed")
		.gte("game_scores.games.created_at", `${seasonYear}-01-01T00:00:00Z`)
		.lte("game_scores.games.created_at", `${seasonYear}-12-31T23:59:59Z`);

	if (error) {
		console.error("Error fetching season standings:", error);
		return [];
	}

	return data
		.map((player) => {
			const scores = player.game_scores || [];
			const first = scores.filter((s) => s.podium_finish === 1).length;
			const second = scores.filter((s) => s.podium_finish === 2).length;
			const third = scores.filter((s) => s.podium_finish === 3).length;
			const totalGames = scores.length;

			return {
				name: player.name,
				avatar: player.avatar_url || "",
				game: totalGames,
				first,
				second,
				third,
				points: calculatePodiumPoints(first, second, third),
			};
		})
		.sort((a, b) => b.points - a.points);
}

/**
 * Fetches real-time scores for an active game session.
 */
export async function getActiveGameStandings(roomId) {
	if (!roomId) return [];
	
	const { data, error } = await supabase
		.from("game_scores")
		.select(`
			round_1_score,
			round_2_score,
			round_3_score,
			bonus_score,
			players (
				name,
				avatar_url
			)
		`)
		.eq("game_id", roomId);

	if (error) {
		console.error("Error fetching active game scores:", error);
		return [];
	}

	return data
		.map((score) => {
			const r1 = score.round_1_score || 0;
			const r2 = score.round_2_score || 0;
			const r3 = score.round_3_score || 0;
			const bonus = score.bonus_score || 0;

			return {
				name: score.players?.name || "Unknown",
				avatar: score.players?.avatar_url || "",
				round1: r1,
				round2: r2,
				round3: r3,
				bonus: bonus,
				points: calculateGamePoints(r1, r2, r3, bonus),
			};
		})
		.sort((a, b) => b.points - a.points);
}

/**
 * Fetches the currently active game (status = 'playing' or 'lobby') if any exists.
 */
export async function getActiveGame() {
	const { data, error } = await supabase
		.from("games")
		.select("id, pin, topic, season, status, total_rounds")
		.neq("status", "completed")
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) {
		console.error("Error fetching active game:", error);
		return null;
	}

	return data;
}
