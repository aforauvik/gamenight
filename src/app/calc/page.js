"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Check,
	X,
	RotateCcw,
	RefreshCw,
	Plus,
	Users,
	Trophy,
	Play,
	Pause,
	Trash2,
	ArrowLeft,
	Volume2,
	VolumeX,
	Flame,
	Sparkles,
	ChevronRight,
} from "lucide-react";
import { rawTeams2026 as allTeams } from "@/components/leaderboard/data";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_PLAYERS_KEY = "gamenight_players_v3";
const STORAGE_STARTED_KEY = "gamenight_started_v3";

const initialPlayers = allTeams.map((player) => ({
	name: player.name,
	avatar: player.avatar,
	isActive: false, // Player starts as inactive by default
	rounds: [
		{
			questions: Array(10).fill(null),
			manualBonus: Array(10).fill(0),
			bonusPoints: 0,
		},
		{
			questions: Array(10).fill(null),
			manualBonus: Array(10).fill(0),
			bonusPoints: 0,
		},
		{
			questions: Array(10).fill(null),
			manualBonus: Array(10).fill(0),
			bonusPoints: 0,
		},
	],
}));

const PointCalculation = () => {
	const [players, setPlayers] = useState([]);
	const [gameStarted, setGameStarted] = useState(false);
	const [customName, setCustomName] = useState("");
	const [activeTab, setActiveTab] = useState(0); // Round index (0, 1, 2)
	const [isClient, setIsClient] = useState(false);
	const [timer, setTimer] = useState(0);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	const bonusSoundRef = useRef(null);
	const tickSoundRef = useRef(null);
	const timeUpSoundRef = useRef(null);
	const timerIntervalRef = useRef(null);
	const hasPlayedTickSound = useRef(false);

	// Custom avatar background gradient based on name hash
	const getAvatarBg = (name) => {
		const colors = [
			"from-pink-500 to-rose-500",
			"from-purple-500 to-indigo-500",
			"from-blue-500 to-cyan-500",
			"from-emerald-500 to-teal-500",
			"from-amber-500 to-orange-500",
			"from-red-500 to-pink-500",
		];
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const index = Math.abs(hash) % colors.length;
		return colors[index];
	};

	// 1. Initial State Load and Migration
	useEffect(() => {
		setIsClient(true);
		const savedPlayers = localStorage.getItem(STORAGE_PLAYERS_KEY);
		const savedStarted = localStorage.getItem(STORAGE_STARTED_KEY);

		if (savedPlayers) {
			try {
				const parsed = JSON.parse(savedPlayers);
				// Standardize player format to support legacy and additions
				const hydrated = parsed.map((p) => {
					const rounds = (p.rounds || []).map((r) => ({
						questions: r.questions || Array(10).fill(null),
						manualBonus: r.manualBonus || Array(10).fill(0),
						bonusPoints: r.bonusPoints || 0,
					}));
					while (rounds.length < 3) {
						rounds.push({
							questions: Array(10).fill(null),
							manualBonus: Array(10).fill(0),
							bonusPoints: 0,
						});
					}
					return {
						name: p.name || "",
						avatar: p.avatar || "",
						isActive: p.isActive !== undefined ? p.isActive : false,
						rounds,
					};
				});
				setPlayers(hydrated);
			} catch (e) {
				console.error("Failed to parse saved players roster", e);
				setPlayers(initialPlayers);
			}
		} else {
			// Check legacy key
			const legacy = localStorage.getItem("pointCalculationScores");
			if (legacy) {
				try {
					const parsed = JSON.parse(legacy);
					const migrated = initialPlayers.map((initial) => {
						const existing = parsed.find((p) => p.name === initial.name);
						if (existing) {
							return {
								...initial,
								isActive: true, // assume they were active since they had scores
								rounds: existing.rounds.map((r) => ({
									questions: r.questions || Array(10).fill(null),
									manualBonus: r.manualBonus || Array(10).fill(0),
									bonusPoints: r.bonusPoints || 0,
								})),
							};
						}
						return initial;
					});
					setPlayers(migrated);
				} catch (e) {
					console.error("Failed to migrate legacy scores", e);
					setPlayers(initialPlayers);
				}
			} else {
				setPlayers(initialPlayers);
			}
		}

		if (savedStarted) {
			setGameStarted(savedStarted === "true");
		}
	}, []);

	// 2. Persist state to localstorage
	useEffect(() => {
		if (isClient) {
			localStorage.setItem(STORAGE_PLAYERS_KEY, JSON.stringify(players));
			localStorage.setItem(STORAGE_STARTED_KEY, String(gameStarted));
		}
	}, [players, gameStarted, isClient]);

	// 3. Audio & Timer Hooks
	useEffect(() => {
		if (timer === 0 && isTimerRunning) {
			setIsTimerRunning(false);
			hasPlayedTickSound.current = false;
			if (timeUpSoundRef.current && !isMuted) {
				timeUpSoundRef.current.currentTime = 0;
				timeUpSoundRef.current.play().catch((error) => {
					console.log("Error playing time up sound:", error);
				});
			}
		} else if (timer === 7 && isTimerRunning && !hasPlayedTickSound.current) {
			if (tickSoundRef.current && !isMuted) {
				tickSoundRef.current.currentTime = 0;
				tickSoundRef.current.play().catch((error) => {
					console.log("Error playing tick sound:", error);
				});
				hasPlayedTickSound.current = true;
			}
		}
	}, [timer, isTimerRunning, isMuted]);

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
	}, []);

	const startTimer = () => {
		if (isTimerRunning) return;

		setTimer(15);
		setIsTimerRunning(true);
		hasPlayedTickSound.current = false;

		timerIntervalRef.current = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					clearInterval(timerIntervalRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const stopTimer = () => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
		}
		setIsTimerRunning(false);
		setTimer(0);
		hasPlayedTickSound.current = false;
	};

	const playBonusSound = () => {
		if (isMuted) return;
		if (bonusSoundRef.current) {
			bonusSoundRef.current.currentTime = 0;
			bonusSoundRef.current.play().catch((error) => {
				console.log("Error playing bonus sound:", error);
			});
		}
	};

	// 4. Calculations Helpers
	const getRoundCorrect = (player, roundIndex) => {
		return player.rounds[roundIndex].questions.filter((q) => q === true).length;
	};

	const calculateConsecutiveBonus = (questions) => {
		let consecutiveCorrect = 0;
		let consecutiveBonus = 0;
		let isBonusActive = false;

		for (let i = 0; i < questions.length; i++) {
			if (questions[i] === true) {
				consecutiveCorrect++;
				if (consecutiveCorrect >= 3) {
					isBonusActive = true;
				}
				if (isBonusActive) {
					consecutiveBonus++;
				}
			} else {
				consecutiveCorrect = 0;
				isBonusActive = false;
			}
		}
		return consecutiveBonus;
	};

	const getRoundManualBonus = (player, roundIndex) => {
		const mb = player.rounds[roundIndex].manualBonus || [];
		return mb.reduce((sum, val) => sum + (val || 0), 0);
	};

	const getRoundTotalBonus = (player, roundIndex) => {
		const consecutive = calculateConsecutiveBonus(player.rounds[roundIndex].questions);
		const manual = getRoundManualBonus(player, roundIndex);
		return consecutive + manual;
	};

	const getTotalBonusPoints = (player) => {
		return player.rounds.reduce((total, _, roundIndex) => {
			return total + getRoundTotalBonus(player, roundIndex);
		}, 0);
	};

	const getTotalCorrectAnswers = (player) => {
		return player.rounds.reduce((total, round) => {
			return total + round.questions.filter((q) => q === true).length;
		}, 0);
	};

	// Calculate weighted game points: R1*5 + R2*10 + R3*15 + All Bonus points
	const calculateWeightedPoints = (player) => {
		const r1Correct = getRoundCorrect(player, 0);
		const r2Correct = getRoundCorrect(player, 1);
		const r3Correct = getRoundCorrect(player, 2);

		const r1Bonus = getRoundTotalBonus(player, 0);
		const r2Bonus = getRoundTotalBonus(player, 1);
		const r3Bonus = getRoundTotalBonus(player, 2);

		return (
			r1Correct * 5 +
			r2Correct * 10 +
			r3Correct * 15 +
			(r1Bonus + r2Bonus + r3Bonus)
		);
	};

	// 5. State Updators
	const togglePlayerActive = (name) => {
		setPlayers((prev) =>
			prev.map((p) => {
				if (p.name === name) {
					return { ...p, isActive: !p.isActive };
				}
				return p;
			})
		);
	};

	const addCustomPlayer = (e) => {
		e.preventDefault();
		if (!customName.trim()) return;

		// Prevent duplicate names
		if (players.some((p) => p.name.toLowerCase() === customName.trim().toLowerCase())) {
			alert("A player with this name already exists!");
			return;
		}

		const newPlayer = {
			name: customName.trim(),
			avatar: "", // custom players have initials avatars
			isActive: true, // Auto activate
			rounds: [
				{
					questions: Array(10).fill(null),
					manualBonus: Array(10).fill(0),
					bonusPoints: 0,
				},
				{
					questions: Array(10).fill(null),
					manualBonus: Array(10).fill(0),
					bonusPoints: 0,
				},
				{
					questions: Array(10).fill(null),
					manualBonus: Array(10).fill(0),
					bonusPoints: 0,
				},
			],
		};

		setPlayers((prev) => [...prev, newPlayer]);
		setCustomName("");
	};

	const handleAnswer = (playerIndex, roundIndex, questionIndex, isCorrect) => {
		setPlayers((prev) => {
			const updated = [...prev];
			const player = { ...updated[playerIndex] };
			const round = { ...player.rounds[roundIndex] };
			const questions = [...round.questions];

			questions[questionIndex] = isCorrect;

			// Calculate consecutive bonus points
			const oldBonus = getRoundTotalBonus(player, roundIndex);
			round.questions = questions;

			// Re-assess total bonus with new consecutive
			const consecutiveBonus = calculateConsecutiveBonus(questions);
			const manualBonus = (round.manualBonus || Array(10).fill(0)).reduce((s, v) => s + v, 0);
			round.bonusPoints = consecutiveBonus + manualBonus;

			player.rounds[roundIndex] = round;
			updated[playerIndex] = player;

			const newBonus = getRoundTotalBonus(player, roundIndex);
			if (newBonus > oldBonus) {
				setTimeout(playBonusSound, 0);
			}

			return updated;
		});
	};

	const resetAnswer = (playerIndex, roundIndex, questionIndex) => {
		setPlayers((prev) => {
			const updated = [...prev];
			const player = { ...updated[playerIndex] };
			const round = { ...player.rounds[roundIndex] };
			const questions = [...round.questions];

			questions[questionIndex] = null;
			round.questions = questions;

			// Recalculate bonus points
			const consecutiveBonus = calculateConsecutiveBonus(questions);
			const manualBonus = (round.manualBonus || Array(10).fill(0)).reduce((s, v) => s + v, 0);
			round.bonusPoints = consecutiveBonus + manualBonus;

			player.rounds[roundIndex] = round;
			updated[playerIndex] = player;

			return updated;
		});
	};

	const handleManualBonus = (playerIndex, roundIndex, questionIndex, val) => {
		setPlayers((prev) => {
			const updated = [...prev];
			const player = { ...updated[playerIndex] };
			const round = { ...player.rounds[roundIndex] };
			const manualBonus = [...(round.manualBonus || Array(10).fill(0))];

			manualBonus[questionIndex] = val;
			round.manualBonus = manualBonus;

			// Recalculate round total bonus points
			const consecutiveBonus = calculateConsecutiveBonus(round.questions);
			const manualBonusTotal = manualBonus.reduce((s, v) => s + v, 0);
			round.bonusPoints = consecutiveBonus + manualBonusTotal;

			player.rounds[roundIndex] = round;
			updated[playerIndex] = player;

			return updated;
		});
	};

	const resetAllScores = () => {
		setPlayers((prev) =>
			prev.map((player) => ({
				...player,
				rounds: [
					{
						questions: Array(10).fill(null),
						manualBonus: Array(10).fill(0),
						bonusPoints: 0,
					},
					{
						questions: Array(10).fill(null),
						manualBonus: Array(10).fill(0),
						bonusPoints: 0,
					},
					{
						questions: Array(10).fill(null),
						manualBonus: Array(10).fill(0),
						bonusPoints: 0,
					},
				],
			}))
		);
	};

	const resetFullGame = () => {
		// Clean up active selections and custom players
		setPlayers(initialPlayers);
		setGameStarted(false);
		stopTimer();
	};

	const removeCustomPlayerFromRoster = (name) => {
		setPlayers((prev) => prev.filter((p) => p.name !== name));
	};

	if (!isClient) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
				<div className="flex flex-col items-center gap-3">
					<RefreshCw className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
					<p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading Game Night Calc...</p>
				</div>
			</div>
		);
	}

	const activeRoster = players.filter((p) => p.isActive);

	// Sort players for leaderboard (by weighted points, descending)
	const leaderboardSorted = [...activeRoster].sort((a, b) => {
		const aPts = calculateWeightedPoints(a);
		const bPts = calculateWeightedPoints(b);
		if (bPts !== aPts) return bPts - aPts;
		// Tie breaker: total correct answers
		return getTotalCorrectAnswers(b) - getTotalCorrectAnswers(a);
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100 to-indigo-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20 px-4 py-8">
			{/* Audio elements */}
			<audio ref={bonusSoundRef} src="/game-bonus.mp3" preload="auto" />
			<audio ref={tickSoundRef} src="/time-ticks.mp3" preload="auto" />
			<audio ref={timeUpSoundRef} src="/time-up.mp3" preload="auto" />

			{/* HEADER */}
			<div className="w-full mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-zinc-800 pb-6 gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
						🎮 Game Night Scorekeeper
					</h1>
					<p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
						Official score sheet, bonus multiplier calculator & leaderboard
					</p>
				</div>

				<div className="flex items-center gap-3 self-end md:self-auto">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setIsMuted(!isMuted)}
						className="h-10 w-10 rounded-xl"
						title={isMuted ? "Unmute sounds" : "Mute sounds"}
					>
						{isMuted ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5 text-indigo-500" />}
					</Button>

					{gameStarted && (
						<div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
							<Button
								onClick={isTimerRunning ? stopTimer : startTimer}
								variant={isTimerRunning ? "destructive" : "default"}
								size="sm"
								className="gap-2 font-semibold h-8 rounded-lg shadow-sm"
							>
								{isTimerRunning ? (
									<>
										<span className="font-mono text-xs">{timer}s</span>
										<Pause className="h-3.5 w-3.5 animate-pulse" />
									</>
								) : (
									<>
										<Play className="h-3.5 w-3.5" />
										<span className="text-xs">Start Timer (15s)</span>
									</>
								)}
							</Button>
							{isTimerRunning && (
								<motion.span
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 1, repeat: Infinity }}
									className="h-2 w-2 rounded-full bg-red-500"
								/>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="w-full">
				<AnimatePresence mode="wait">
					{!gameStarted ? (
						/* PHASE 1: ROSTER SETUP MODE */
						<motion.div
							key="setup"
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -15 }}
							transition={{ duration: 0.25 }}
							className="grid grid-cols-1 lg:grid-cols-3 gap-8"
						>
							{/* Select & Add Section */}
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md">
									<h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2 flex items-center gap-2">
										<Users className="h-5 w-5 text-indigo-500" />
										Select Active Players
									</h2>
									<p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
										Click on players who will participate in this game. They will be added to the score sheet grid.
									</p>

									{/* Default Players Grid */}
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
										{players
											.filter((p) => allTeams.some((t) => t.name === p.name))
											.map((player) => {
												const isSelected = player.isActive;
												return (
													<motion.button
														key={player.name}
														onClick={() => togglePlayerActive(player.name)}
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
															isSelected
																? "bg-indigo-50/70 border-indigo-500/50 shadow-indigo-100/40 dark:bg-indigo-950/30 dark:border-indigo-500/50 dark:shadow-none"
																: "bg-slate-50/50 border-slate-200 hover:bg-slate-100 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:bg-zinc-800"
														}`}
													>
														<div className="relative mb-2">
															<Avatar className={`h-16 w-16 border-2 transition-all ${isSelected ? "border-indigo-500 scale-105" : "border-transparent"}`}>
																<AvatarImage src={player.avatar} alt={player.name} />
																<AvatarFallback className="bg-slate-200 text-slate-700 font-bold dark:bg-zinc-800 dark:text-zinc-300">
																	{player.name.substring(0, 2).toUpperCase()}
																</AvatarFallback>
															</Avatar>
															{isSelected && (
																<motion.div
																	initial={{ scale: 0 }}
																	animate={{ scale: 1 }}
																	className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border border-white dark:border-zinc-950"
																>
																	<Check className="h-3 w-3 stroke-[3px]" />
																</motion.div>
															)}
														</div>
														<span className={`text-sm font-semibold truncate w-full ${isSelected ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-zinc-300"}`}>
															{player.name}
														</span>
													</motion.button>
												);
											})}
									</div>
								</div>

								{/* Custom Add Form */}
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md">
									<h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2 flex items-center gap-2">
										<Plus className="h-5 w-5 text-indigo-500" />
										Add Custom Player
									</h2>
									<p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
										Not in the standard roster? Quick-create a new player for this session.
									</p>

									<form onSubmit={addCustomPlayer} className="flex gap-2">
										<input
											type="text"
											placeholder="Enter player name..."
											value={customName}
											onChange={(e) => setCustomName(e.target.value)}
											className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-zinc-100"
										/>
										<Button type="submit" className="rounded-xl px-5 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium">
											<Plus className="h-4 w-4" /> Add
										</Button>
									</form>

									{/* Custom Players List */}
									{players.filter((p) => !allTeams.some((t) => t.name === p.name)).length > 0 && (
										<div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4">
											<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Custom Players Added</p>
											<div className="flex flex-wrap gap-2">
												{players
													.filter((p) => !allTeams.some((t) => t.name === p.name))
													.map((player) => (
														<div
															key={player.name}
															className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-2 pr-1 rounded-xl text-sm"
														>
															<span className={`h-6 w-6 rounded-full bg-gradient-to-br ${getAvatarBg(player.name)} text-[10px] font-bold text-white flex items-center justify-center`}>
																{player.name.substring(0, 2).toUpperCase()}
															</span>
															<span className="font-semibold text-slate-700 dark:text-zinc-300">{player.name}</span>
															<button
																type="button"
																onClick={() => removeCustomPlayerFromRoster(player.name)}
																className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
															>
																<Trash2 className="h-3.5 w-3.5" />
															</button>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Summary & Launch Lobby Column */}
							<div className="space-y-6">
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md flex flex-col justify-between h-full min-h-[300px]">
									<div>
										<h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
											<Trophy className="h-5 w-5 text-amber-500" />
											Playing Roster
										</h2>

										{activeRoster.length === 0 ? (
											<div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-zinc-500">
												<Users className="h-12 w-12 stroke-[1.5] mb-2 opacity-50" />
												<p className="text-sm font-medium">Roster is empty</p>
												<p className="text-xs text-center px-4 mt-1">Select players from the list or add custom ones to begin the game!</p>
											</div>
										) : (
											<div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
												{activeRoster.map((player, idx) => (
													<motion.div
														layoutId={`roster-${player.name}`}
														key={player.name}
														className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-200/60 dark:border-zinc-800/80"
													>
														<div className="flex items-center gap-2.5">
															<span className="text-xs text-slate-400 dark:text-zinc-500 font-mono w-4">{String(idx + 1).padStart(2, "0")}</span>
															{player.avatar ? (
																<Avatar className="h-8 w-8 border border-slate-200 dark:border-zinc-800">
																	<AvatarImage src={player.avatar} alt={player.name} />
																	<AvatarFallback className="bg-slate-200 dark:bg-zinc-800 font-bold text-xs">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
																</Avatar>
															) : (
																<span className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarBg(player.name)} text-[10px] font-bold text-white flex items-center justify-center border border-white dark:border-zinc-900`}>
																	{player.name.substring(0, 2).toUpperCase()}
																</span>
															)}
															<span className="font-semibold text-sm text-slate-800 dark:text-zinc-200 truncate max-w-[120px]">{player.name}</span>
														</div>

														<button
															onClick={() => togglePlayerActive(player.name)}
															className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
															title="Remove player"
														>
															<X className="h-4 w-4" />
														</button>
													</motion.div>
												))}
											</div>
										)}
									</div>

									<div className="pt-6 border-t border-slate-100 dark:border-zinc-800 mt-6">
										<div className="flex justify-between text-sm mb-4">
											<span className="text-slate-500 dark:text-zinc-400 font-medium">Roster size:</span>
											<span className="font-bold text-slate-800 dark:text-zinc-200">{activeRoster.length} players</span>
										</div>

										<Button
											disabled={activeRoster.length === 0}
											onClick={() => setGameStarted(true)}
											className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold tracking-wide shadow-md shadow-indigo-200 dark:shadow-none transition-all gap-2"
										>
											Start Game Night <ChevronRight className="h-5 w-5" />
										</Button>
									</div>
								</div>
							</div>
						</motion.div>
					) : (
						/* PHASE 2: ACTIVE SCORING BOARD */
						<motion.div
							key="scoring"
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -15 }}
							transition={{ duration: 0.25 }}
							className="grid grid-cols-1 lg:grid-cols-12 gap-8"
						>
							{/* SCORING GRIDS (Left Side - 8 cols) */}
							<div className="lg:col-span-8 space-y-6">
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md">
									{/* Scoring Header */}
									<div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800 gap-4">
										<div>
											<button
												onClick={() => setGameStarted(false)}
												className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition-colors group mb-1.5"
											>
												<ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
												Back to Roster setup
											</button>
											<h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100">Scoring Sheets</h2>
										</div>

										{/* Round Navigation Capsule */}
										<div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start">
											{[0, 1, 2].map((idx) => (
												<button
													key={idx}
													onClick={() => setActiveTab(idx)}
													className={`relative p-2 px-4 text-xs font-bold rounded-lg transition-all ${
														activeTab === idx
															? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
															: "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
													}`}
												>
													Round {idx + 1}
													{activeTab === idx && (
														<motion.span
															layoutId="activeRoundIndicator"
															className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"
														/>
													)}
												</button>
											))}
										</div>
									</div>

									{/* Round Scoring Table */}
									<div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
										<Table>
											<TableHeader className="bg-slate-50 dark:bg-zinc-900/80">
												<TableRow>
													<TableHead className="w-[140px] font-bold text-slate-700 dark:text-zinc-300">Player</TableHead>
													{Array.from({ length: 10 }, (_, qIdx) => (
														<TableHead key={qIdx} className="text-center font-bold text-slate-700 dark:text-zinc-300 w-[55px] min-w-[55px] p-2">
															Q{qIdx + 1}
														</TableHead>
													))}
													<TableHead className="text-center font-bold text-slate-700 dark:text-zinc-300 w-[60px] min-w-[60px]">Bonus</TableHead>
													<TableHead className="text-center font-bold text-slate-700 dark:text-zinc-300 w-[60px] min-w-[60px]">Correct</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{activeRoster.map((player) => {
													const playerIndex = players.findIndex((p) => p.name === player.name);
													const round = player.rounds[activeTab];
													const isPlayerTop = leaderboardSorted[0]?.name === player.name;

													return (
														<TableRow key={player.name} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/20">
															{/* Player Profile Cell */}
															<TableCell className="p-3 font-medium">
																<div className="flex items-center gap-2">
																	{player.avatar ? (
																		<Avatar className="h-8 w-8 border border-slate-200 dark:border-zinc-800">
																			<AvatarImage src={player.avatar} alt={player.name} />
																			<AvatarFallback className="bg-slate-200 dark:bg-zinc-800 font-bold text-xs">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
																		</Avatar>
																	) : (
																		<span className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarBg(player.name)} text-[10px] font-bold text-white flex items-center justify-center border border-white dark:border-zinc-900`}>
																			{player.name.substring(0, 2).toUpperCase()}
																		</span>
																	)}
																	<div className="flex flex-col truncate max-w-[85px]">
																		<span className="font-semibold text-sm text-slate-800 dark:text-zinc-200 truncate flex items-center gap-0.5">
																			{player.name}
																			{isPlayerTop && <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse flex-shrink-0" />}
																		</span>
																		<span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
																			{calculateWeightedPoints(player)} pts
																		</span>
																	</div>
																</div>
															</TableCell>

															{/* Q1-Q10 Cells */}
															{round.questions.map((answer, questionIndex) => {
																const manualBonusValue = round.manualBonus?.[questionIndex] || 0;
																return (
																	<TableCell key={questionIndex} className="p-1.5 text-center vertical-middle">
																		<div className="flex flex-col items-center gap-1.5">
																			{/* Check / Cross Buttons */}
																			{answer === null ? (
																				<div className="flex bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-slate-200/50 dark:border-zinc-800/80">
																					<button
																						onClick={() => handleAnswer(playerIndex, activeTab, questionIndex, true)}
																						className="p-1 hover:bg-white dark:hover:bg-zinc-900 rounded-md text-slate-400 hover:text-emerald-500 transition-colors"
																						title="Correct answer"
																					>
																						<Check className="h-3.5 w-3.5" />
																					</button>
																					<button
																						onClick={() => handleAnswer(playerIndex, activeTab, questionIndex, false)}
																						className="p-1 hover:bg-white dark:hover:bg-zinc-900 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
																						title="Incorrect answer"
																					>
																						<X className="h-3.5 w-3.5" />
																					</button>
																				</div>
																			) : (
																				<div className="relative group flex items-center justify-center">
																					<button
																						onClick={() => resetAnswer(playerIndex, activeTab, questionIndex)}
																						className={`p-1.5 rounded-xl flex items-center justify-center transition-all ${
																							answer
																								? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/30"
																								: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/30"
																						}`}
																					>
																						{answer ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : <X className="h-3.5 w-3.5 stroke-[3px]" />}
																						{/* Undo Hover state overlay */}
																						<div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all shadow-inner border border-slate-200 dark:border-zinc-700">
																							<RotateCcw className="h-3 w-3 text-slate-500 dark:text-zinc-400" />
																						</div>
																					</button>
																				</div>
																			)}

																			{/* Manual Bonus Spinner */}
																			<div className="flex items-center gap-0.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-md p-0.5">
																				<button
																					disabled={manualBonusValue <= 0}
																					onClick={() => handleManualBonus(playerIndex, activeTab, questionIndex, Math.max(0, manualBonusValue - 1))}
																					className="text-[9px] font-bold h-4 w-4 bg-slate-100 dark:bg-zinc-800 rounded hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
																				>
																					-
																				</button>
																				<span className="text-[10px] font-bold font-mono text-slate-700 dark:text-zinc-300 w-3 text-center">
																					{manualBonusValue}
																				</span>
																				<button
																					disabled={manualBonusValue >= 5}
																					onClick={() => handleManualBonus(playerIndex, activeTab, questionIndex, Math.min(5, manualBonusValue + 1))}
																					className="text-[9px] font-bold h-4 w-4 bg-slate-100 dark:bg-zinc-800 rounded hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
																				>
																					+
																				</button>
																			</div>
																		</div>
																	</TableCell>
																);
															})}

															{/* Bonus points Cell */}
															<TableCell className="p-3 text-center vertical-middle">
																<div className="flex flex-col items-center">
																	<span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 p-1 px-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
																		{getRoundTotalBonus(player, activeTab)}
																	</span>
																	{calculateConsecutiveBonus(round.questions) > 0 && (
																		<span className="text-[9px] font-bold text-amber-500 mt-1 flex items-center gap-0.5">
																			<Flame className="h-2.5 w-2.5 fill-amber-500" />
																			Streak
																		</span>
																	)}
																</div>
															</TableCell>

															{/* Correct count Cell */}
															<TableCell className="p-3 text-center font-extrabold text-slate-800 dark:text-zinc-100 text-sm vertical-middle">
																{getRoundCorrect(player, activeTab)} / 10
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</div>

									{/* Scoring Legend */}
									<div className="flex flex-wrap items-center justify-between mt-6 bg-slate-50/50 dark:bg-zinc-900/30 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 gap-4 text-xs text-slate-500 dark:text-zinc-400">
										<div className="flex flex-wrap gap-4">
											<span className="flex items-center gap-1.5">
												<span className="h-2 w-2 rounded-full bg-emerald-500" />
												Correct: +1 Correct Pt
											</span>
											<span className="flex items-center gap-1.5">
												<span className="h-2 w-2 rounded-full bg-indigo-500" />
												Streak Bonus: +1 pt for every correct after 3 in a row
											</span>
											<span className="flex items-center gap-1.5">
												<span className="h-2 w-2 rounded-full bg-slate-400" />
												Manual Bonus: (Max 5 per question)
											</span>
										</div>

										<div className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-lg">
											Round Multipliers: R1 = 5x | R2 = 10x | R3 = 15x
										</div>
									</div>
								</div>

								{/* Control Panel (Resets / Wipes) */}
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md flex flex-wrap gap-3 items-center justify-between">
									<div className="text-sm">
										<h4 className="font-bold text-slate-800 dark:text-zinc-200">Game Management</h4>
										<p className="text-xs text-slate-400 dark:text-zinc-500">Reset scores, re-order roster, or erase session progress</p>
									</div>

									<div className="flex flex-wrap gap-2.5">
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="outline" className="rounded-xl font-medium gap-2 border-slate-200 text-slate-700 dark:text-zinc-300">
													<RefreshCw className="h-4 w-4" /> Reset All Scores
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent className="rounded-2xl">
												<AlertDialogHeader>
													<AlertDialogTitle className="font-bold">Reset All Roster Scores?</AlertDialogTitle>
													<AlertDialogDescription>
														This will clear every checkmark, cross, and manual bonus across all 3 rounds.
														Your active roster will remain unchanged. This cannot be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
													<AlertDialogAction onClick={resetAllScores} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
														Reset Scores
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="destructive" className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white gap-2">
													<Trash2 className="h-4 w-4" /> End & Reset Game
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent className="rounded-2xl">
												<AlertDialogHeader>
													<AlertDialogTitle className="font-bold text-red-600">Erase Entire Session?</AlertDialogTitle>
													<AlertDialogDescription>
														Are you absolutely sure you want to end this game night?
														This will clear all scores, deactivate all players, delete custom additions, and return to the Roster Lobby.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
													<AlertDialogAction onClick={resetFullGame} className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
														Delete Session
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</div>

							{/* LIVE LEADERBOARD (Right Side - 4 cols) */}
							<div className="lg:col-span-4 space-y-6">
								<div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md flex flex-col h-full">
									<div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
										<h3 className="font-extrabold text-slate-800 dark:text-zinc-100 text-lg flex items-center gap-2">
											<Trophy className="h-5 w-5 text-amber-500 fill-amber-500/20" />
											Live Standings
										</h3>
										<span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 p-1 px-2 rounded">
											Real-time
										</span>
									</div>

									{activeRoster.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-12 text-slate-400">
											<Users className="h-10 w-10 opacity-30 mb-2" />
											<p className="text-xs font-semibold">No players active</p>
										</div>
									) : (
										/* Ranks list with framer-motion slide layouts */
										<div className="space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-1">
											<AnimatePresence>
												{leaderboardSorted.map((player, idx) => {
													const totalPoints = calculateWeightedPoints(player);
													const rawCorrect = getTotalCorrectAnswers(player);
													const totalBonus = getTotalBonusPoints(player);
													const rank = idx + 1;

													let medalStyle = "bg-slate-50 dark:bg-zinc-800/40 border-slate-200/50 dark:border-zinc-800";
													let rankBadge = "bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400";
													let rankIcon = null;

													if (rank === 1) {
														medalStyle = "bg-[#47B39C]/5 dark:bg-[#47B39C]/10 border-[#47B39C]/40 shadow-md shadow-[#47B39C]/5";
														rankBadge = "bg-[#47B39C] text-white font-extrabold ring-4 ring-[#47B39C]/20";
														rankIcon = "👑";
													} else if (rank === 2) {
														medalStyle = "bg-[#FBBE53]/5 dark:bg-[#FBBE53]/10 border-[#FBBE53]/40 shadow-sm shadow-[#FBBE53]/5";
														rankBadge = "bg-[#FBBE53] text-white font-extrabold ring-4 ring-[#FBBE53]/20";
														rankIcon = "🥈";
													} else if (rank === 3) {
														medalStyle = "bg-[#DE6552]/5 dark:bg-[#DE6552]/10 border-[#DE6552]/40 shadow-sm shadow-[#DE6552]/5";
														rankBadge = "bg-[#DE6552] text-white font-extrabold ring-4 ring-[#DE6552]/20";
														rankIcon = "🥉";
													}

													return (
														<motion.div
															layout
															key={`rank-${player.name}`}
															initial={{ opacity: 0, x: 20 }}
															animate={{ opacity: 1, x: 0 }}
															exit={{ opacity: 0, x: -20 }}
															transition={{ type: "spring", stiffness: 350, damping: 25 }}
															className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${medalStyle}`}
														>
															<div className="flex items-center gap-3.5">
																{/* Rank bubble */}
																<span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${rankBadge}`}>
																	{rank}
																</span>

																<div className="relative">
																	{player.avatar ? (
																		<Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-800 shadow-sm">
																			<AvatarImage src={player.avatar} alt={player.name} />
																			<AvatarFallback className="bg-slate-200 dark:bg-zinc-800 font-bold text-xs">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
																		</Avatar>
																	) : (
																		<span className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarBg(player.name)} text-xs font-bold text-white flex items-center justify-center border border-white dark:border-zinc-900 shadow-sm`}>
																			{player.name.substring(0, 2).toUpperCase()}
																		</span>
																	)}
																	{rankIcon && <span className="absolute -top-2 -right-1 text-xs">{rankIcon}</span>}
																</div>

																<div className="flex flex-col">
																	<span className="font-bold text-slate-800 dark:text-zinc-200 text-sm truncate max-w-[110px]">{player.name}</span>
																	<span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
																		Correct: <strong className="text-slate-600 dark:text-zinc-400">{rawCorrect}</strong> | Bonus: <strong className="text-slate-600 dark:text-zinc-400">{totalBonus}</strong>
																	</span>
																</div>
															</div>

															{/* Points score pill */}
															<div className="text-right flex flex-col justify-center">
																<span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
																	{totalPoints}
																</span>
																<span className="text-[9px] text-slate-400 dark:text-zinc-500 font-semibold tracking-wide uppercase mt-0.5">points</span>
															</div>
														</motion.div>
													);
												})}
											</AnimatePresence>
										</div>
									)}

									{/* Total score standings view link */}
									<div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-center">
										<p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1">
											<Sparkles className="h-3 w-3 text-indigo-500" />
											Rankings use weighted formulas automatically.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default PointCalculation;
