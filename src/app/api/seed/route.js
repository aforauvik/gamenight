import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 1. Static historical data from History.js
const history2026 = [
	{ date: "2026-05-26", name: "Aunt Sabrina", topic: "New York Facts", season: "June, 2026", round1: 10, round2: 4, round3: 6, bonus: 11 },
	{ date: "2026-05-19", name: "Hannah", topic: "North Carolina Facts", season: "June, 2026", round1: 7, round2: 7, round3: 7, bonus: 7 },
	{ date: "2026-04-28", name: "Hannah", topic: "US States", season: "June, 2026", round1: 9, round2: 5, round3: 4, bonus: 5 },
	{ date: "2026-03-31", name: "Grandma", topic: "General Knowledge", season: "June, 2026", round1: 10, round2: 7, round3: 4, bonus: 11 },
	{ date: "2026-03-24", name: "Grandma", topic: "General Knowledge", season: "June, 2026", round1: 10, round2: 6, round3: 4, bonus: 8 }
];

const history2025 = [
	{ date: "2025-12-02", name: "Julian", topic: "Space Facts II", season: "April, 2026", round1: 9, round2: 7, round3: 9, bonus: 16 },
	{ date: "2025-10-28", name: "Hannah", topic: "Space Facts I", season: "April, 2026", round1: 9, round2: 9, round3: 8, bonus: 16 },
	{ date: "2025-10-14", name: "Christine", topic: "World War II", season: "April, 2026", round1: 6, round2: 5, round3: 2, bonus: 2 },
	{ date: "2025-10-07", name: "Hannah", topic: "Sitcom Showdown", season: "April, 2026", round1: 10, round2: 5, round3: 4, bonus: 8 },
	{ date: "2025-09-16", name: "Mom", topic: "Continental Showdown", season: "April, 2026", round1: 10, round2: 9, round3: 5, bonus: 14 },
	{ date: "2025-08-12", name: "Hannah", topic: "Health Insurance", season: "April, 2026", round1: 8, round2: 8, round3: 9, bonus: 21 },
	{ date: "2025-08-05", name: "Christine", topic: "TV Facts", season: "April, 2026", round1: 10, round2: 4, round3: 7, bonus: 13 },
	{ date: "2025-07-22", name: "Grandma", topic: "Interesting Word Records", season: "April, 2026", round1: 4, round2: 4, round3: 6, bonus: 2 },
	{ date: "2025-07-15", name: "Aunt Sabrina", topic: "Words That Meant Something Else", season: "April, 2026", round1: 4, round2: 5, round3: 3, bonus: 1 },
	{ date: "2025-07-08", name: "Hannah", topic: "Disney Cartoon", season: "April, 2026", round1: 9, round2: 7, round3: 8, bonus: 9 },
	{ date: "2025-07-01", name: "Julian", topic: "True or False - Tech Edition", season: "April, 2026", round1: 5, round2: 7, round3: 8, bonus: 3 },
	{ date: "2025-06-10", name: "Hannah", topic: "Super Hero Showdown", season: "April, 2026", round1: 8, round2: 6, round3: 4, bonus: 4 },
	{ date: "2025-06-03", name: "Christine", topic: "Modern Day Pop Culture", season: "April, 2026", round1: 9, round2: 6, round3: 4, bonus: 7 },
	{ date: "2025-05-29", name: "Christine", topic: "Guess The Person", season: "April, 2026", round1: 22, round2: 36, round3: 15, bonus: 0 },
	{ date: "2025-04-29", name: "Hannah", topic: "Learn About Asia", season: "April, 2026", round1: 5, round2: 7, round3: 7, bonus: 3 },
	{ date: "2025-04-22", name: "Christine", topic: "Learn About Africa", season: "April, 2026", round1: 8, round2: 4, round3: 3, bonus: 3 },
	{ date: "2025-04-15", name: "Landon", topic: "Space Facts", season: "April, 2026", round1: 10, round2: 3, round3: 9, bonus: 2 },
	{ date: "2025-04-08", name: "Grandma", topic: "Animal Facts", season: "April, 2026", round1: 9, round2: 6, round3: 8, bonus: 0 },
	{ date: "2025-04-01", name: "Hannah", topic: "Food Facts", season: "April, 2026", round1: 9, round2: 5, round3: 7, bonus: 0 },
	{ date: "2025-03-25", name: "Christine", topic: "Facts About US States", season: "April, 2026", round1: 7, round2: 4, round3: 4, bonus: 0 },
	{ date: "2025-03-04", name: "Landon", topic: "Guess The Movie From A Quote", season: "April, 2026", round1: 7, round2: 4, round3: 4, bonus: 0 },
	{ date: "2025-02-25", name: "Julian", topic: "Riddle Night", season: "April, 2026", round1: 5, round2: 5, round3: 7, bonus: 0 },
	{ date: "2025-02-18", name: "Hannah", topic: "Guess The Logo", season: "April, 2026", round1: 5, round2: 5, round3: 7, bonus: 0 },
	{ date: "2025-02-11", name: "Grandma", topic: "True Or False", season: "April, 2026", round1: 5, round2: 5, round3: 7, bonus: 0 },
	{ date: "2025-01-21", name: "Aunt Sabrina", topic: "American History", season: "April, 2026", round1: 5, round2: 5, round3: 7, bonus: 0 },
	{ date: "2025-01-14", name: "Aunt Sabrina", topic: "Pop Culture", season: "April, 2026", round1: 5, round2: 5, round3: 7, bonus: 0 }
];

// 2. Player names and avatars
const initialPlayers = [
	{ name: "Grandma", avatar_url: "/grandma.webp" },
	{ name: "Aunt Sabrina", avatar_url: "/aunt-sabrina.webp" },
	{ name: "Mom", avatar_url: "/mom.webp" },
	{ name: "Hannah", avatar_url: "/hannah.jpeg" },
	{ name: "Leif", avatar_url: "/leif.jpeg" },
	{ name: "Julian", avatar_url: "/julian.jpeg" },
	{ name: "Landon", avatar_url: "/landon.jpeg" },
	{ name: "Christine", avatar_url: "/christine.jpeg" },
	{ name: "Leo", avatar_url: "/leo.jpeg" }
];

// 3. Trophies needed to align standings exactly
const standingsPodiums = {
	"2026": {
		"Grandma": { first: 2, second: 2, third: 0 },
		"Aunt Sabrina": { first: 1, second: 0, third: 0 },
		"Mom": { first: 0, second: 1, third: 0 },
		"Hannah": { first: 2, second: 1, third: 2 },
		"Leif": { first: 0, second: 0, third: 0 },
		"Julian": { first: 0, second: 0, third: 3 },
		"Landon": { first: 0, second: 0, third: 0 },
		"Christine": { first: 0, second: 0, third: 0 },
		"Leo": { first: 0, second: 1, third: 0 }
	},
	"2025": {
		"Grandma": { first: 4, second: 7, third: 2 },
		"Aunt Sabrina": { first: 4, second: 4, third: 0 },
		"Mom": { first: 2, second: 3, third: 6 },
		"Hannah": { first: 9, second: 10, third: 6 },
		"Leif": { first: 0, second: 0, third: 0 },
		"Julian": { first: 3, second: 3, third: 9 },
		"Landon": { first: 2, second: 1, third: 1 },
		"Christine": { first: 6, second: 3, third: 1 },
		"Leo": { first: 0, second: 1, third: 0 }
	}
};

export async function GET() {
	try {
		// --- STEP 1: UPSERT PLAYERS ---
		const playerMap = {};
		for (const p of initialPlayers) {
			const { data, error } = await supabase
				.from("players")
				.select("id")
				.eq("name", p.name)
				.maybeSingle();
			
			if (error) throw error;

			if (data) {
				playerMap[p.name] = data.id;
			} else {
				const { data: inserted, error: insertErr } = await supabase
					.from("players")
					.insert(p)
					.select()
					.single();
				if (insertErr) throw insertErr;
				playerMap[p.name] = inserted.id;
			}
		}

		// --- STEP 2: SEED HISTORY GAMES & WINNER SCORES ---
		let gamesInserted = 0;
		let scoresInserted = 0;

		const allHistory = [
			...history2026.map(h => ({ ...h, year: "2026" })),
			...history2025.map(h => ({ ...h, year: "2025" }))
		];

		for (const h of allHistory) {
			// Check if game already seeded
			const { data: existingGame } = await supabase
				.from("games")
				.select("id")
				.eq("topic", h.topic)
				.eq("season", h.season)
				.eq("created_at", h.date)
				.maybeSingle();

			let gameId = existingGame?.id;

			if (!gameId) {
				const { data: newGame, error: gameErr } = await supabase
					.from("games")
					.insert({
						topic: h.topic,
						season: h.season,
						status: "completed",
						created_at: h.date
					})
					.select()
					.single();
				
				if (gameErr) throw gameErr;
				gameId = newGame.id;
				gamesInserted++;
			}

			// Add winner score (podium = 1)
			const winnerId = playerMap[h.name];
			if (winnerId) {
				const { error: scoreErr } = await supabase
					.from("game_scores")
					.upsert({
						game_id: gameId,
						player_id: winnerId,
						round_1_score: h.round1,
						round_2_score: h.round2,
						round_3_score: h.round3,
						bonus_score: h.bonus,
						podium_finish: 1
					}, { onConflict: "game_id,player_id" });

				if (scoreErr) throw scoreErr;
				scoresInserted++;
			}
		}

		// --- STEP 3: MOCK BALANCING GAMES FOR Standings (first, second, third counts) ---
		// We want the aggregated counts of first, second, and third to match standingsPodiums exactly.
		// Since we already inserted the actual history games (giving 1st place finishes),
		// we can add a single "Season Summary Tally" game for each season to absorb all other 2nd & 3rd places
		// (and any missing 1st places).
		
		const seasons = ["2026", "2025"];
		for (const year of seasons) {
			const seasonLabel = year === "2026" ? "June, 2026" : "April, 2026";
			const mockDate = year === "2026" ? "2026-05-30" : "2025-12-15";

			// Try to find summary game
			const { data: summaryGame } = await supabase
				.from("games")
				.select("id")
				.eq("topic", "Podium Balance Tracker")
				.eq("season", seasonLabel)
				.maybeSingle();

			let summaryGameId = summaryGame?.id;

			if (!summaryGameId) {
				const { data: newGame, error: gameErr } = await supabase
					.from("games")
					.insert({
						topic: "Podium Balance Tracker",
						season: seasonLabel,
						status: "completed",
						created_at: mockDate
					})
					.select()
					.single();
				if (gameErr) throw gameErr;
				summaryGameId = newGame.id;
			}

			// Now calculate what is already recorded vs what is needed
			const targetPodiums = standingsPodiums[year];
			
			for (const playerName of Object.keys(targetPodiums)) {
				const targets = targetPodiums[playerName];
				const pId = playerMap[playerName];

				// Count what first places are already recorded in games
				const { data: firstPlaces } = await supabase
					.from("game_scores")
					.select("id, games!inner(season)")
					.eq("player_id", pId)
					.eq("podium_finish", 1)
					.eq("games.season", seasonLabel);

				const existingFirsts = firstPlaces?.length || 0;
				const neededFirsts = Math.max(0, targets.first - existingFirsts);

				// Insert corresponding balance scores
				// To keep it simple, we record their 2nd and 3rd place finishes in the summary game.
				// (If they need multiple, we can insert entries or mock values).
				if (targets.second > 0 || targets.third > 0 || neededFirsts > 0) {
					// We'll write a loop or add multiple rows
					// For secondary finishes, we record a representative score in the balance game:
					await supabase
						.from("game_scores")
						.upsert({
							game_id: summaryGameId,
							player_id: pId,
							round_1_score: 0,
							round_2_score: 0,
							round_3_score: 0,
							bonus_score: 0,
							// If they had 1st place finishes missing, assign here
							podium_finish: neededFirsts > 0 ? 1 : targets.second > 0 ? 2 : targets.third > 0 ? 3 : null
						}, { onConflict: "game_id,player_id" });

					// Note: If they have multiple 2nd/3rd places, we can insert separate mock game logs.
					// Let's create extra mock games for matching counts if needed.
					let runIdx = 1;
					
					// Insert extra mock games for seconds
					for (let s = 0; s < targets.second; s++) {
						const mockGameTopic = `Podium Standings Match ${runIdx++}`;
						const { data: mockG } = await supabase
							.from("games")
							.insert({
								topic: mockGameTopic,
								season: seasonLabel,
								status: "completed",
								created_at: mockDate
							})
							.select()
							.single();

						await supabase.from("game_scores").insert({
							game_id: mockG.id,
							player_id: pId,
							podium_finish: 2
						});
					}

					// Insert extra mock games for thirds
					for (let t = 0; t < targets.third; t++) {
						const mockGameTopic = `Podium Standings Match ${runIdx++}`;
						const { data: mockG } = await supabase
							.from("games")
							.insert({
								topic: mockGameTopic,
								season: seasonLabel,
								status: "completed",
								created_at: mockDate
							})
							.select()
							.single();

						await supabase.from("game_scores").insert({
							game_id: mockG.id,
							player_id: pId,
							podium_finish: 3
						});
					}
				}
			}
		}

		return NextResponse.json({
			status: "success",
			message: "Database seeded successfully!",
			players: Object.keys(playerMap).length,
			historyGames: allHistory.length,
		});

	} catch (error) {
		console.error("Seeding Error:", error);
		return NextResponse.json({
			status: "error",
			message: error.message,
		}, { status: 500 });
	}
}
