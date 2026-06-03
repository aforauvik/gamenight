"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Sparkles, Gamepad2, Flame, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { getActiveGame, getActiveGameStandings } from "../services/leaderboardService";

function getRankRowStyle(rank) {
	if (rank === 1) {
		return "bg-gradient-to-r from-[#47B39C]/10 to-[#47B39C]/5 dark:from-[#47B39C]/20 dark:to-zinc-900/50 border-l-4 border-[#47B39C] font-medium transition-all hover:bg-[#47B39C]/15";
	} else if (rank === 2) {
		return "bg-gradient-to-r from-[#FBBE53]/10 to-[#FBBE53]/5 dark:from-[#FBBE53]/20 dark:to-zinc-900/50 border-l-4 border-[#FBBE53] font-medium transition-all hover:bg-[#FBBE53]/15";
	} else if (rank === 3) {
		return "bg-gradient-to-r from-[#DE6552]/10 to-[#DE6552]/5 dark:from-[#DE6552]/20 dark:to-zinc-900/50 border-l-4 border-[#DE6552] font-medium transition-all hover:bg-[#DE6552]/15";
	}
	return "hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 border-l-4 border-transparent transition-all";
}

function getRankBadge(rank) {
	if (rank === 1) {
		return (
			<span className="flex items-center gap-1 bg-[#47B39C] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm ring-4 ring-[#47B39C]/20">
				👑 1st
			</span>
		);
	} else if (rank === 2) {
		return (
			<span className="flex items-center gap-1 bg-[#FBBE53] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm ring-4 ring-[#FBBE53]/20">
				🥈 2nd
			</span>
		);
	} else if (rank === 3) {
		return (
			<span className="flex items-center gap-1 bg-[#DE6552] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm ring-4 ring-[#DE6552]/20">
				🥉 3rd
			</span>
		);
	}
	return (
		<span className="text-slate-500 dark:text-zinc-500 font-semibold px-2">
			{String(rank).padStart(2, "0")}
		</span>
	);
}

const Standings = () => {
	const [activeGame, setActiveGame] = useState(null);
	const [standings, setStandings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLive, setIsLive] = useState(false);

	const fetchStandings = async () => {
		try {
			setIsLoading(true);
			const game = await getActiveGame();
			
			if (game) {
				setActiveGame(game);
				setIsLive(game.status !== "completed");
				const scores = await getActiveGameStandings(game.id);
				setStandings(scores.map((s, index) => ({ ...s, rank: index + 1 })));
			} else {
				// No active game, fetch the most recent completed game
				const { data: latestGame } = await supabase
					.from("games")
					.select("id, pin, topic, season, status, total_rounds")
					.eq("status", "completed")
					.order("created_at", { ascending: false })
					.limit(1)
					.maybeSingle();

				if (latestGame) {
					setActiveGame({ ...latestGame, label: "Last Game Night" });
					setIsLive(false);
					const scores = await getActiveGameStandings(latestGame.id);
					setStandings(scores.map((s, index) => ({ ...s, rank: index + 1 })));
				} else {
					setActiveGame(null);
					setStandings([]);
				}
			}
		} catch (error) {
			console.error("Error loading standings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStandings();
	}, []);

	// Real-Time subscription for game score changes
	useEffect(() => {
		if (!activeGame || !isLive) return;

		const channel = supabase
			.channel(`active-standings-${activeGame.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "game_scores",
					filter: `game_id=eq.${activeGame.id}`,
				},
				async () => {
					const scores = await getActiveGameStandings(activeGame.id);
					setStandings(scores.map((s, index) => ({ ...s, rank: index + 1 })));
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [activeGame?.id, isLive]);

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-6">
			<hr className="border-slate-200 dark:border-zinc-800 border-[1px] w-full mb-6"></hr>

			{/* HEADER TOOLBAR */}
			<div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-6 gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<Trophy className="h-6 w-6 text-amber-500 animate-bounce" />
						<h1 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-tight flex items-center gap-2">
							Family Gaming League
							{isLive && (
								<span className="relative flex h-3.5 w-3.5">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
								</span>
							)}
						</h1>
					</div>
					<p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
						<Sparkles className="h-4 w-4" />
						{activeGame ? `Active Season: ${activeGame.season}` : "Create a game room to start!"}
					</p>
				</div>

				<div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
					{activeGame && (
						<div className="text-left md:text-right">
							<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500 block">
								{isLive ? "Live Game" : "Last Played"}
							</span>
							<p className="text-sm font-extrabold text-slate-700 dark:text-zinc-300 truncate max-w-[200px]">
								{activeGame.topic}
							</p>
						</div>
					)}

					<div className="flex gap-2">
						<button
							onClick={fetchStandings}
							className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
							title="Refresh Standings"
						>
							<RefreshCw className="h-4 w-4 text-slate-500" />
						</button>

						<Link href="/host">
							<Button variant="default" size="sm" className="rounded-xl font-bold h-9 bg-indigo-600 hover:bg-indigo-700 text-white">
								Host Room
							</Button>
						</Link>

						<Link href="/join">
							<Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-slate-200 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300">
								Join Game
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<hr className="border-slate-200 dark:border-zinc-800 border-[1px] w-full mb-6"></hr>

			{/* STANDINGS TABLE */}
			<div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md p-4">
				<h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-4 px-2 flex items-center justify-between">
					<span>{isLive ? "Live Game Scoreboard" : "Last Match Final Standings"}</span>
					{isLive && activeGame?.pin && (
						<span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md font-mono">
							PIN: {activeGame.pin}
						</span>
					)}
				</h3>

				{isLoading ? (
					<div className="py-8 text-center text-slate-500">Loading standings...</div>
				) : standings.length === 0 ? (
					<div className="py-12 text-center text-slate-400 font-medium">
						No active players or completed matches found. Start a game to see scoreboard!
					</div>
				) : (
					<div className="overflow-x-auto rounded-xl">
						<Table>
							<TableHeader className="bg-slate-50 dark:bg-zinc-900">
								<TableRow>
									<TableHead className="w-[120px] font-bold text-slate-700 dark:text-zinc-300">Rank</TableHead>
									<TableHead className="font-bold text-slate-700 dark:text-zinc-300">Player</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 1 (5x)</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 2 (10x)</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 3 (15x)</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Bonus</TableHead>
									<TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">Total Points</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{standings.map((team, index) => (
									<TableRow key={index} className={getRankRowStyle(team.rank)}>
										<TableCell className="align-middle py-3">
											{getRankBadge(team.rank)}
										</TableCell>
										<TableCell className="flex items-center gap-3 py-3 align-middle">
											<Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-800 shadow-sm">
												<AvatarImage src={team.avatar} alt={team.name} />
												<AvatarFallback className="font-bold bg-slate-200 dark:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
													{team.name.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
												{team.name}
											</span>
										</TableCell>
										<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
											{team.round1}
										</TableCell>
										<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
											{team.round2}
										</TableCell>
										<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
											{team.round3}
										</TableCell>
										<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
											{team.bonus}
										</TableCell>
										<TableCell className="text-right py-3 align-middle font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
											{team.points}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
};

export default Standings;
