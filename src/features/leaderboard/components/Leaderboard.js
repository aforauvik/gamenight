"use client";

import React, { useEffect, useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSeasonStandings } from "../services/leaderboardService";
import { RankingGraph } from "../../../components/leaderboard/RankingGraph";
import { StandingGraph } from "../../../components/leaderboard/StandingGraph";

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

const Leaderboard = () => {
	const [activeYear, setActiveYear] = useState("2026");
	const [standings, setStandings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchStandings = async () => {
		try {
			setIsLoading(true);
			const seasonData = await getSeasonStandings(activeYear);
			setStandings(seasonData.map((t, idx) => ({ ...t, rank: idx + 1 })));
		} catch (error) {
			console.error("Error fetching season standings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStandings();
	}, [activeYear]);

	const totalGames = standings.reduce((acc, curr) => acc + curr.game, 0) || 1;

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
			{/* LEADERBOARD TABLE CARD */}
			<div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md p-6">
				
				{/* Header Toolbar */}
				<div className="flex flex-col sm:flex-row w-full justify-between sm:items-center pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800 gap-4">
					<div>
						<h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
							<Trophy className="h-5 w-5 text-amber-500 fill-amber-500/10" />
							All-Time Leaderboard
						</h2>
						<p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
							Aggregated standings based on podium positions across games (1st = 3pts, 2nd = 2pts, 3rd = 1pt)
						</p>
					</div>

					{/* Animated Season Tabs */}
					<div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto">
						{["2026", "2025"].map((year) => (
							<button
								key={year}
								onClick={() => setActiveYear(year)}
								className={`relative p-2 px-5 text-xs font-bold rounded-lg transition-all ${
									activeYear === year
										? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
										: "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
								}`}
							>
								{year} Season
								{activeYear === year && (
									<motion.span
										layoutId="activeYearIndicator"
										className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"
									/>
								)}
							</button>
						))}
					</div>
				</div>

				{/* Leaderboard Grid */}
				{isLoading ? (
					<div className="py-8 text-center text-slate-500">Loading standings...</div>
				) : standings.length === 0 ? (
					<div className="py-12 text-center text-slate-400 font-medium">
						No completed games recorded in {activeYear} yet.
					</div>
				) : (
					<div className="overflow-x-auto rounded-xl">
						<Table>
							<TableHeader className="bg-slate-50 dark:bg-zinc-900">
								<TableRow>
									<TableHead className="w-[120px] font-bold text-slate-700 dark:text-zinc-300">Rank</TableHead>
									<TableHead className="font-bold text-slate-700 dark:text-zinc-300">Player</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Total Games</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">🥇 1st Place</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">🥈 2nd Place</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">🥉 3rd Place</TableHead>
									<TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">Podium Points</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<AnimatePresence mode="wait">
									{standings.map((team, index) => (
										<TableRow key={`${activeYear}-${team.name}`} className={getRankRowStyle(team.rank)}>
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
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400 font-semibold">
												{team.game}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
												{team.first}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
												{team.second}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400">
												{team.third}
											</TableCell>
											<TableCell className="text-right py-3 align-middle font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
												{team.points}
											</TableCell>
										</TableRow>
									))}
								</AnimatePresence>
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			{/* GRAPHS SECTION */}
			{!isLoading && standings.length > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full py-2">
					<RankingGraph data={standings} year={activeYear} />
					<StandingGraph data={standings} year={activeYear} totalGames={totalGames} />
				</div>
			)}
		</div>
	);
};

export default Leaderboard;
