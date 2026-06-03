"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { quizData } from "@/app/questions/data";
import {
	createGameRoom,
	updateGameState,
	finalizeGame,
	updatePlayerBonus,
} from "@/features/game/services/gameService";
import { getActiveGameStandings } from "@/features/leaderboard/services/leaderboardService";
import { Users, Play, SkipForward, CheckCircle, Trophy, Clock, X, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function HostPage() {
	const router = useRouter();
	
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState([]);
	const [answerCount, setAnswerCount] = useState(0);
	const [standings, setStandings] = useState([]);
	
	// Timer state
	const [timer, setTimer] = useState(15);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const timerIntervalRef = useRef(null);

	// Reveal details
	const [showAnswer, setShowAnswer] = useState(false);

	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			topic: "",
			season: "June, 2026",
		}
	});

	// Fetch active game on load
	useEffect(() => {
		const fetchActiveGame = async () => {
			const { data, error } = await supabase
				.from("games")
				.select("*")
				.neq("status", "completed")
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (!error && data) {
				setGame(data);
			}
		};
		fetchActiveGame();
	}, []);

	// Fetch players in the lobby / game
	const fetchLobbyPlayers = async () => {
		if (!game) return;
		const { data, error } = await supabase
			.from("game_scores")
			.select("players (name, avatar_url), bonus_score")
			.eq("game_id", game.id);

		if (!error && data) {
			setPlayers(data.map(p => ({
				name: p.players?.name || "Unknown",
				avatar: p.players?.avatar_url || "",
				bonus: p.bonus_score || 0,
			})));
		}
	};

	// Fetch count of answers submitted for current question
	const fetchAnswerCount = async () => {
		if (!game) return;
		
		const roundKey = `round${game.current_round}`;
		const currentRoundQuestions = quizData[roundKey] || [];
		const currentQuestion = currentRoundQuestions[game.current_question_index];
		if (!currentQuestion) return;

		const { count, error } = await supabase
			.from("player_responses")
			.select("*", { count: "exact", head: true })
			.eq("game_id", game.id)
			.eq("question_id", currentQuestion.id);

		if (!error) {
			setAnswerCount(count || 0);
		}
	};

	// Fetch live standings
	const fetchStandings = async () => {
		if (!game) return;
		const scores = await getActiveGameStandings(game.id);
		setStandings(scores);
	};

	// Sync database updates for players and responses
	useEffect(() => {
		if (!game) return;

		fetchLobbyPlayers();
		fetchAnswerCount();
		fetchStandings();

		// Subscribe to game_scores (players joining or updating scores)
		const scoresChannel = supabase
			.channel(`host-scores-sync-${game.id}`)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "game_scores", filter: `game_id=eq.${game.id}` },
				() => {
					fetchLobbyPlayers();
					fetchStandings();
				}
			)
			.subscribe();

		// Subscribe to player_responses (answers coming in)
		const responsesChannel = supabase
			.channel(`host-responses-sync-${game.id}`)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "player_responses", filter: `game_id=eq.${game.id}` },
				() => {
					fetchAnswerCount();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(scoresChannel);
			supabase.removeChannel(responsesChannel);
		};
	}, [game?.id, game?.current_question_index, game?.current_round]);

	// Timer ticks
	useEffect(() => {
		if (timer === 0 && isTimerRunning) {
			stopTimer();
		}
	}, [timer, isTimerRunning]);

	const startTimer = () => {
		setTimer(15);
		setIsTimerRunning(true);
		if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
		timerIntervalRef.current = setInterval(() => {
			setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);
	};

	const stopTimer = () => {
		if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
		setIsTimerRunning(false);
	};

	const handleCreateGame = async (values) => {
		try {
			const newGame = await createGameRoom(values.topic, values.season);
			setGame(newGame);
		} catch (error) {
			alert("Error starting game session. Please verify that the database table structure is set up correctly.");
		}
	};

	const handleStartGame = async () => {
		if (!game) return;
		const updated = await updateGameState(game.id, { status: "playing" });
		setGame(updated);
	};

	const handleRevealAnswer = () => {
		setShowAnswer(true);
		stopTimer();
	};

	const roundKey = game ? `round${game.current_round}` : "round1";
	const currentRoundQuestions = quizData[roundKey] || [];
	const currentQuestion = game ? currentRoundQuestions[game.current_question_index] : null;

	const handleNextQuestion = async () => {
		if (!game || !currentQuestion) return;
		setShowAnswer(false);
		setAnswerCount(0);
		setTimer(15);
		setIsTimerRunning(false);

		const isLastInRound = game.current_question_index === currentRoundQuestions.length - 1;
		
		if (isLastInRound) {
			if (game.current_round < 3) {
				// Advance round
				const updated = await updateGameState(game.id, {
					current_round: game.current_round + 1,
					current_question_index: 0,
				});
				setGame(updated);
			} else {
				// Completed last question
				const updated = await updateGameState(game.id, { status: "leaderboard" });
				setGame(updated);
			}
		} else {
			// Advance question index
			const updated = await updateGameState(game.id, {
				current_question_index: game.current_question_index + 1,
			});
			setGame(updated);
		}
	};

	const handleFinalize = async () => {
		if (!game) return;
		if (confirm("Are you sure you want to end this game? Standings will be finalized.")) {
			await finalizeGame(game.id);
			router.push("/");
		}
	};

	const handleAddBonus = async (name, amount) => {
		if (!game) return;
		await updatePlayerBonus(game.id, name, amount);
		fetchLobbyPlayers();
		fetchStandings();
	};

	// 1. Setup new Game room
	if (!game) {
		return (
			<div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative">
				{/* Back Link */}
				<div className="mb-6 w-full max-w-md">
					<Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
						<ArrowLeft className="h-3.5 w-3.5" />
						<span>Back to Home</span>
					</Link>
				</div>

				<Card className="w-full max-w-md bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 shadow-md rounded-2xl">
					<CardHeader className="border-b border-slate-100 dark:border-zinc-800">
						<CardTitle className="text-2xl font-extrabold text-center">Host Game Night</CardTitle>
						<CardDescription className="text-slate-500 dark:text-zinc-400 text-center">
							Configure your quiz topic and season to launch the room
						</CardDescription>
					</CardHeader>
					<CardContent className="py-6">
						<form onSubmit={handleSubmit(handleCreateGame)} className="space-y-4">
							<div className="space-y-2">
								<label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-zinc-500">Game Topic</label>
								<input
									placeholder="e.g. New York Facts"
									className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 font-bold p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									{...register("topic", { required: true })}
								/>
							</div>

							<div className="space-y-2">
								<label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-zinc-500">Season / Period</label>
								<input
									placeholder="e.g. June, 2026"
									className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 font-bold p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									{...register("season", { required: true })}
								/>
							</div>

							<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all mt-2">
								Open Game Room
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 2. Waiting Lobby view
	if (game.status === "lobby") {
		return (
			<div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 p-8 relative flex flex-col justify-between">
				<div className="max-w-4xl mx-auto w-full text-center space-y-8">
					<div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl inline-block shadow-sm">
						<span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
							JOIN ON YOUR PHONE WITH PIN
						</span>
						<h1 className="text-6xl font-black font-mono tracking-widest text-indigo-700 dark:text-indigo-300">{game.pin}</h1>
					</div>

					<div>
						<h2 className="text-3xl font-black text-slate-800 dark:text-zinc-100">{game.topic}</h2>
						<p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Season: {game.season}</p>
					</div>

					<Separator className="border-slate-200 dark:border-zinc-800" />

					<div>
						<h3 className="text-lg font-bold text-slate-600 dark:text-zinc-400 flex items-center justify-center gap-2 mb-6">
							<Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
							Players Connected ({players.length})
						</h3>

						{players.length === 0 ? (
							<div className="text-slate-400 text-sm italic py-8 bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-2xl">
								Waiting for players to enter the PIN...
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								{players.map((p, idx) => (
									<div key={idx} className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm transition-all hover:shadow-md">
										<div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 dark:border-zinc-800">
											<img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
										</div>
										<span className="font-extrabold text-sm text-slate-700 dark:text-zinc-200">{p.name}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="max-w-4xl mx-auto w-full flex justify-center pb-6">
					<Button
						onClick={handleStartGame}
						disabled={players.length === 0}
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all"
					>
						<Play className="h-5 w-5 fill-white" />
						<span>Start Game Night</span>
					</Button>
				</div>
			</div>
		);
	}

	// 3. Game finished final standing view
	if (game.status === "leaderboard") {
		return (
			<div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 p-8">
				<div className="max-w-3xl mx-auto space-y-6">
					<div className="text-center space-y-2">
						<Trophy className="h-16 w-16 text-amber-500 mx-auto animate-bounce" />
						<h1 className="text-4xl font-black text-slate-800 dark:text-zinc-100">Game Standings</h1>
						<p className="text-slate-500 dark:text-zinc-400 text-sm">Final podium points for {game.topic}</p>
					</div>

					<Card className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl shadow-md p-4">
						<div className="space-y-3">
							{standings.map((team, idx) => (
								<div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
									<div className="flex items-center gap-4">
										<span className="font-mono text-lg text-slate-400 font-bold">#{idx + 1}</span>
										<div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 dark:border-zinc-850">
											<img src={team.avatar} alt={team.name} className="h-full w-full object-cover" />
										</div>
										<span className="font-extrabold text-slate-700 dark:text-zinc-200 text-base">{team.name}</span>
									</div>
									<span className="font-mono text-indigo-600 dark:text-indigo-400 font-black text-lg">{team.points} pts</span>
								</div>
							))}
						</div>
					</Card>

					<div className="flex justify-center gap-4">
						<Button onClick={handleFinalize} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm">
							Save Results & Close Room
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// 4. Main Question presenter view
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 p-6 flex flex-col justify-between">
			<div className="max-w-4xl mx-auto w-full space-y-6">
				{/* Top bar info */}
				<div className="flex justify-between items-center bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm">
					<div>
						<span className="text-[10px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-wider block">Topic</span>
						<span className="text-sm font-extrabold text-slate-700 dark:text-zinc-200">{game.topic}</span>
					</div>
					<div className="text-center">
						<span className="text-[10px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-wider block">Round</span>
						<span className="text-sm font-extrabold text-slate-700 dark:text-zinc-200">{game.current_round}</span>
					</div>
					<div className="text-right">
						<span className="text-[10px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-wider block">PIN Code</span>
						<span className="text-sm font-mono font-black text-indigo-600 dark:text-indigo-400">{game.pin}</span>
					</div>
				</div>

				{/* Question Card */}
				{!currentQuestion ? (
					<div className="text-center py-20 text-slate-400 italic">Retrieving question details...</div>
				) : (
					<Card className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl shadow-md overflow-hidden">
						<div className="p-8 space-y-6">
							<div className="flex justify-between items-start gap-4">
								<h2 className="text-2xl font-black leading-snug flex-1 text-slate-800 dark:text-zinc-100">
									{currentQuestion.question}
								</h2>

								{/* Timer pill */}
								<div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-full font-mono text-sm font-extrabold text-amber-500">
									<Clock className="h-4 w-4" />
									<span>{timer}s</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
								{currentQuestion.options.map((option, idx) => {
									const isCorrect = option === currentQuestion.correctAnswer;
									let itemStyle = "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30 text-slate-700 dark:text-zinc-300";
									
									if (showAnswer) {
										itemStyle = isCorrect
											? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold"
											: "border-rose-500/20 bg-rose-500/5 text-slate-400 opacity-60";
									}

									return (
										<div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${itemStyle}`}>
											<span className="h-6 w-6 rounded bg-black/5 dark:bg-black/20 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
												{String.fromCharCode(65 + idx)}
											</span>
											<span>{option}</span>
										</div>
									);
								})}
							</div>

							{showAnswer && (
								<div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 text-sm space-y-1">
									<span className="font-extrabold text-indigo-600 dark:text-indigo-400 block">Explanation:</span>
									<p className="text-slate-600 dark:text-zinc-300">{currentQuestion.description}</p>
								</div>
							)}
						</div>
					</Card>
				)}

				{/* Live Answer Status & Leaderboard standings */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="md:col-span-1 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
						<Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-2 animate-pulse" />
						<span className="text-3xl font-black text-slate-800 dark:text-zinc-100">{answerCount} / {players.length}</span>
						<span className="text-xs uppercase font-extrabold text-slate-400 dark:text-zinc-500 mt-1.5 tracking-wider">
							Answers Submitted
						</span>
					</Card>

					<Card className="md:col-span-2 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl p-6 shadow-sm">
						<span className="text-xs uppercase font-extrabold text-slate-400 dark:text-zinc-500 tracking-wider block mb-3">
							Quick Room Scores & Adjustments
						</span>
						<div className="space-y-2 max-h-40 overflow-y-auto pr-1">
							{players.map((p, idx) => (
								<div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-zinc-800 last:border-0">
									<span className="font-bold text-slate-700 dark:text-zinc-300">{p.name}</span>
									<div className="flex items-center gap-3">
										<span className="text-slate-500 font-mono">Bonus: {p.bonus}</span>
										<div className="flex gap-1.5">
											<button
												onClick={() => handleAddBonus(p.name, 5)}
												className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-100 dark:border-emerald-900/20"
											>
												+5
											</button>
											<button
												onClick={() => handleAddBonus(p.name, -5)}
												className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-extrabold border border-rose-100 dark:border-rose-900/20"
											>
												-5
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>

			{/* Controller Actions footer */}
			<div className="max-w-4xl mx-auto w-full flex flex-wrap gap-3 justify-between items-center border-t border-slate-200 dark:border-zinc-800 pt-4 mt-6">
				<div className="flex gap-2">
					<Button
						onClick={isTimerRunning ? stopTimer : startTimer}
						variant={isTimerRunning ? "destructive" : "outline"}
						size="sm"
						className="rounded-xl font-bold h-10 gap-2 text-xs border-slate-200 dark:border-zinc-800 dark:hover:bg-zinc-850 hover:bg-slate-50"
					>
						<Clock className="h-4 w-4" />
						<span>{isTimerRunning ? "Stop Timer" : "Start Timer"}</span>
					</Button>

					<Button
						onClick={handleRevealAnswer}
						disabled={showAnswer}
						variant="outline"
						size="sm"
						className="rounded-xl font-bold h-10 gap-2 text-xs border-slate-200 dark:border-zinc-800 dark:hover:bg-zinc-850 hover:bg-slate-50"
					>
						<CheckCircle className="h-4 w-4 text-emerald-500" />
						<span>Reveal Answer</span>
					</Button>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={handleNextQuestion}
						variant="default"
						size="sm"
						className="rounded-xl font-bold h-10 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs transition-all"
					>
						<span>{game.current_question_index === currentRoundQuestions.length - 1 && game.current_round === 3 ? "Tally Standings" : "Next Question"}</span>
						<SkipForward className="h-4 w-4 fill-white" />
					</Button>

					<Button
						onClick={handleFinalize}
						variant="destructive"
						size="sm"
						className="rounded-xl font-bold h-10 gap-2 text-xs bg-rose-600 hover:bg-rose-700 border border-rose-500/30"
					>
						<X className="h-4 w-4" />
						<span>Cancel Game</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
