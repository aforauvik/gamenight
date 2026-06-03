"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { quizData } from "@/app/questions/data";
import { submitAnswer } from "@/features/game/services/gameService";
import { Smile, CheckCircle, RefreshCw, LogOut } from "lucide-react";

export default function PlayPage() {
	const router = useRouter();
	
	const [playerId, setPlayerId] = useState(null);
	const [playerName, setPlayerName] = useState("");
	const [gameId, setGameId] = useState(null);
	const [gamePin, setGamePin] = useState("");
	
	const [gameState, setGameState] = useState({
		status: "lobby",
		current_round: 1,
		current_question_index: 0,
	});
	
	const [selectedOption, setSelectedOption] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	
	// Load player session details
	useEffect(() => {
		const storedPlayerId = sessionStorage.getItem("gamenight_player_id");
		const storedPlayerName = sessionStorage.getItem("gamenight_player_name");
		const storedGameId = sessionStorage.getItem("gamenight_game_id");
		const storedGamePin = sessionStorage.getItem("gamenight_game_pin");

		if (!storedPlayerId || !storedGameId) {
			router.push("/join");
			return;
		}

		setPlayerId(storedPlayerId);
		setPlayerName(storedPlayerName);
		setGameId(storedGameId);
		setGamePin(storedGamePin);

		// Get initial game state
		const fetchInitialGameState = async () => {
			const { data, error } = await supabase
				.from("games")
				.select("status, current_round, current_question_index")
				.eq("id", storedGameId)
				.single();

			if (!error && data) {
				setGameState(data);
			}
		};

		fetchInitialGameState();
	}, [router]);

	// Real-Time subscription for game status, round, and question updates
	useEffect(() => {
		if (!gameId) return;

		const channel = supabase
			.channel(`player-game-updates-${gameId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "games",
					filter: `id=eq.${gameId}`,
				},
				(payload) => {
					const newState = payload.new;
					setGameState({
						status: newState.status,
						current_round: newState.current_round,
						current_question_index: newState.current_question_index,
					});
					
					// Reset submitted states for a new question card
					setIsSubmitted(false);
					setSelectedOption(null);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [gameId]);

	// Get current active question card data
	const roundKey = `round${gameState.current_round}`;
	const currentRoundQuestions = quizData[roundKey] || [];
	const currentQuestion = currentRoundQuestions[gameState.current_question_index];

	const handleOptionSelect = async (option) => {
		if (isSubmitted || loading) return;
		setSelectedOption(option);
		setLoading(true);

		const isCorrect = option === currentQuestion.correctAnswer;
		try {
			await submitAnswer(
				gameId,
				playerId,
				currentQuestion.id,
				gameState.current_round,
				option,
				isCorrect
			);
			setIsSubmitted(true);
		} catch (error) {
			console.error("Error submitting answer:", error);
			alert("Error submitting answer. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleLeave = () => {
		sessionStorage.clear();
		router.push("/");
	};

	// 1. Lobby screen
	if (gameState.status === "lobby") {
		return (
			<div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 relative overflow-hidden">
				<div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px]" />
				
				<div className="flex justify-between items-center z-10">
					<span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
						Lobby PIN: {gamePin}
					</span>
					<button onClick={handleLeave} className="text-slate-400 hover:text-white p-2">
						<LogOut className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-12">
					<div className="h-24 w-24 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 animate-bounce">
						<Smile className="h-12 w-12 text-indigo-400" />
					</div>
					<h1 className="text-3xl font-black mb-2">You&apos;re In, {playerName}!</h1>
					<p className="text-slate-400 text-sm max-w-xs">
						Waiting for the host to start the game on the projector screen...
					</p>
				</div>

				<div className="text-center text-slate-500 text-xs z-10 pb-4">
					Game Night Mobile Controller
				</div>
			</div>
		);
	}

	// 2. Completed / Finished screen
	if (gameState.status === "completed") {
		return (
			<div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 relative overflow-hidden">
				<div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px]" />

				<div className="flex justify-end z-10">
					<button onClick={handleLeave} className="text-slate-400 hover:text-white p-2">
						<LogOut className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-12">
					<div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
						<CheckCircle className="h-10 w-10 text-emerald-400" />
					</div>
					<h1 className="text-3xl font-black mb-2">Game Over! 🏁</h1>
					<p className="text-slate-400 text-sm max-w-xs">
						Check the main dashboard screen to see who won the final podium trophies!
					</p>
				</div>

				<div className="z-10 pb-6 flex justify-center">
					<Button onClick={handleLeave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full max-w-xs py-3 rounded-xl">
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	// 3. Question Active view
	return (
		<div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-5 relative overflow-hidden">
			<div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px]" />

			{/* Controller Header */}
			<div className="flex justify-between items-center z-10 mb-4">
				<div>
					<span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider block">Round {gameState.current_round}</span>
					<span className="text-sm font-extrabold text-white">Question {gameState.current_question_index + 1}</span>
				</div>
				<div className="text-right">
					<span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Player</span>
					<span className="text-sm font-extrabold text-slate-300">{playerName}</span>
				</div>
			</div>

			{/* Options selection panel */}
			<div className="flex-1 flex flex-col justify-center gap-4 z-10 my-4">
				{!currentQuestion ? (
					<div className="text-center text-slate-400">Loading next card...</div>
				) : isSubmitted ? (
					<div className="text-center py-12 space-y-4">
						<div className="mx-auto h-16 w-16 rounded-full bg-indigo-600/20 flex items-center justify-center animate-pulse">
							<CheckCircle className="h-8 w-8 text-indigo-400" />
						</div>
						<h2 className="text-2xl font-black">Answer Locked In!</h2>
						<p className="text-slate-400 text-sm">
							You chose: <strong className="text-white font-bold">{selectedOption}</strong>
						</p>
						<p className="text-xs text-slate-500">Waiting for other players to submit...</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl mb-4 shadow-sm text-center">
							<span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider block mb-1">Active Question</span>
							<h2 className="text-base font-bold text-white leading-relaxed">
								{currentQuestion.question}
							</h2>
						</div>
						<div className="grid grid-cols-1 gap-3.5">
							{currentQuestion.options.map((option, index) => {
								const colors = [
									"bg-rose-600 hover:bg-rose-500 border-rose-500/50 shadow-rose-600/10",
									"bg-blue-600 hover:bg-blue-500 border-blue-500/50 shadow-blue-600/10",
									"bg-amber-600 hover:bg-amber-500 border-amber-500/50 shadow-amber-600/10",
									"bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-emerald-600/10",
								];
								const buttonStyle = colors[index % colors.length];

								return (
									<button
										key={index}
										onClick={() => handleOptionSelect(option)}
										disabled={loading}
										className={`w-full text-left font-extrabold text-base p-5 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] ${buttonStyle} shadow-lg text-white disabled:opacity-50`}
									>
										<span className="h-7 w-7 rounded-lg bg-black/20 flex items-center justify-center font-mono text-sm">
											{String.fromCharCode(65 + index)}
										</span>
										<span>{option}</span>
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>

			<div className="text-center text-[10px] text-slate-600 z-10 py-2 uppercase font-bold tracking-wider">
				Lobby PIN: {gamePin}
			</div>
		</div>
	);
}
