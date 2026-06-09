import {supabase} from "@/lib/supabase";
import {getActiveGameStandings} from "@/features/leaderboard/services/leaderboardService";

/**
 * Creates a new active game room with a unique PIN.
 */
export async function createGameRoom(topic, season) {
	let pin = "";
	let isUnique = false;
	let attempts = 0;

	// Keep trying to generate a unique 4-digit PIN
	while (!isUnique && attempts < 10) {
		pin = Math.floor(1000 + Math.random() * 9000).toString();
		const {data} = await supabase
			.from("games")
			.select("id")
			.eq("pin", pin)
			.maybeSingle();

		if (!data) {
			isUnique = true;
		}
		attempts++;
	}

	const {data: newGame, error} = await supabase
		.from("games")
		.insert({
			pin,
			topic,
			season,
			status: "lobby",
			current_round: 1,
			current_question_index: 0,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating game room:", error);
		throw error;
	}

	return newGame;
}

/**
 * Registers an anonymous player and joins them to the game room.
 */
export async function joinGameRoom(pin, nickname) {
	// 1. Fetch active game by PIN
	const {data: game, error: gameError} = await supabase
		.from("games")
		.select("*")
		.eq("pin", pin)
		.neq("status", "completed")
		.maybeSingle();

	if (gameError || !game) {
		throw new Error("Invalid or inactive game PIN code.");
	}

	const trimmedName = nickname.trim();

	// 2. Fetch or create the player record
	const {data: existingPlayer, error: findError} = await supabase
		.from("players")
		.select("*")
		.ilike("name", trimmedName)
		.maybeSingle();

	if (findError) {
		console.error("Error looking up player:", findError);
		throw findError;
	}

	let player;

	if (existingPlayer) {
		player = existingPlayer;
	} else {
		// Create a new player record
		const avatars = [
			"/grandma.webp",
			"/tabitha.webp",
			"/sabrina.webp",
			"/hannah.webp",
			"/leif.webp",
			"/julian.webp",
			"/landon.webp",
			"/christine.webp",
			"/leo.webp",
		];
		const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

		const {data: newPlayer, error: playerError} = await supabase
			.from("players")
			.insert({
				name: trimmedName,
				avatar_url: randomAvatar,
			})
			.select()
			.single();

		if (playerError) {
			console.error("Error registering player:", playerError);
			throw playerError;
		}
		player = newPlayer;
	}

	// 3. Check if game score record already exists for this player in this game session
	const {data: existingScore, error: scoreCheckError} = await supabase
		.from("game_scores")
		.select("id")
		.eq("game_id", game.id)
		.eq("player_id", player.id)
		.maybeSingle();

	if (scoreCheckError) {
		console.error("Error checking score entry:", scoreCheckError);
		throw scoreCheckError;
	}

	if (!existingScore) {
		// Create the game score record for the player
		const {error: scoreError} = await supabase.from("game_scores").insert({
			game_id: game.id,
			player_id: player.id,
			round_1_score: 0,
			round_2_score: 0,
			round_3_score: 0,
			bonus_score: 0,
		});

		if (scoreError) {
			console.error("Error creating score entry:", scoreError);
			throw scoreError;
		}
	}

	return {player, game};
}

/**
 * Submits a player's answer, computes correctness, and aggregates the round score.
 */
export async function submitAnswer(
	gameId,
	playerId,
	questionId,
	round,
	selectedOption,
	isCorrect,
) {
	// 1. Upsert response into player_responses
	const {error: responseError} = await supabase.from("player_responses").upsert(
		{
			game_id: gameId,
			player_id: playerId,
			question_id: questionId,
			round: round,
			selected_option: selectedOption,
			is_correct: isCorrect,
		},
		{onConflict: "game_id,player_id,question_id"},
	);

	if (responseError) {
		console.error("Error writing player response:", responseError);
		throw responseError;
	}

	// 2. Fetch the aggregate count of correct answers in this round for this player
	const {data: correctResponses, error: countError} = await supabase
		.from("player_responses")
		.select("id")
		.eq("game_id", gameId)
		.eq("player_id", playerId)
		.eq("round", round)
		.eq("is_correct", true);

	if (countError) {
		console.error("Error counting correct responses:", countError);
		throw countError;
	}

	const correctCount = correctResponses.length;

	// 3. Update the game_scores table dynamically
	const updateFields = {};
	if (round === 1) updateFields.round_1_score = correctCount;
	if (round === 2) updateFields.round_2_score = correctCount;
	if (round === 3) updateFields.round_3_score = correctCount;

	const {error: scoreUpdateError} = await supabase
		.from("game_scores")
		.update(updateFields)
		.eq("game_id", gameId)
		.eq("player_id", playerId);

	if (scoreUpdateError) {
		console.error("Error updating player score:", scoreUpdateError);
		throw scoreUpdateError;
	}

	// 4. Automatically add bonus point for 3-in-a-row correct answer streak
	if (isCorrect) {
		try {
			const {data: allResponses, error: fetchErr} = await supabase
				.from("player_responses")
				.select("question_id, is_correct")
				.eq("game_id", gameId)
				.eq("player_id", playerId);

			if (!fetchErr && allResponses) {
				const sorted = allResponses.sort(
					(a, b) => a.question_id - b.question_id,
				);
				let streak = 0;
				for (let i = sorted.length - 1; i >= 0; i--) {
					if (sorted[i].is_correct) {
						streak++;
					} else {
						break;
					}
				}

				if (streak > 0 && streak % 3 === 0) {
					// Fetch current bonus score
					const {data: scoreData} = await supabase
						.from("game_scores")
						.select("bonus_score")
						.eq("game_id", gameId)
						.eq("player_id", playerId)
						.maybeSingle();

					const currentBonus = scoreData?.bonus_score || 0;

					await supabase
						.from("game_scores")
						.update({bonus_score: currentBonus + 1})
						.eq("game_id", gameId)
						.eq("player_id", playerId);
				}
			}
		} catch (streakErr) {
			console.error("Error calculating streak or updating bonus:", streakErr);
		}
	}

	return {correctCount};
}

/**
 * Updates the game active states (question index, round, or status).
 */
export async function updateGameState(gameId, updates) {
	const {data, error} = await supabase
		.from("games")
		.update(updates)
		.eq("id", gameId)
		.select()
		.single();

	if (error) {
		console.error("Error updating game state:", error);
		throw error;
	}

	return data;
}

/**
 * Adjusts bonus points directly for a player.
 */
export async function updatePlayerBonus(gameId, name, bonusDelta) {
	// Find player ID
	const {data: player} = await supabase
		.from("players")
		.select("id")
		.eq("name", name)
		.limit(1)
		.single();

	if (!player) return;

	// Get current bonus
	const {data: scoreData} = await supabase
		.from("game_scores")
		.select("bonus_score")
		.eq("game_id", gameId)
		.eq("player_id", player.id)
		.single();

	const currentBonus = scoreData?.bonus_score || 0;

	await supabase
		.from("game_scores")
		.update({bonus_score: currentBonus + bonusDelta})
		.eq("game_id", gameId)
		.eq("player_id", player.id);
}

/**
 * Ends the active game session, computes final rankings, registers podium finishes, and clears the PIN.
 */
export async function finalizeGame(gameId) {
	// 1. Get active standings sorted desc
	const standings = await getActiveGameStandings(gameId);

	// 2. Assign podium positions (1st, 2nd, 3rd) based on final points
	for (let i = 0; i < standings.length; i++) {
		const entry = standings[i];
		const podiumPosition = i === 0 ? 1 : i === 1 ? 2 : i === 2 ? 3 : null;

		// Fetch player record to get their UUID
		const {data: player} = await supabase
			.from("players")
			.select("id")
			.eq("name", entry.name)
			.limit(1)
			.single();

		if (player) {
			await supabase
				.from("game_scores")
				.update({podium_finish: podiumPosition})
				.eq("game_id", gameId)
				.eq("player_id", player.id);
		}
	}

	// 3. Mark the game as completed and remove its active PIN
	const {error} = await supabase
		.from("games")
		.update({
			status: "completed",
			pin: null,
		})
		.eq("id", gameId);

	if (error) {
		console.error("Error finalizing game:", error);
		throw error;
	}
}
