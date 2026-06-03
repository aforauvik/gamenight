"use client";

import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
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
import { getGameHistory } from "../services/leaderboardService";

const History = () => {
	const [activeYear, setActiveYear] = useState("2026");
	const [historyData, setHistoryData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchHistory = async () => {
		try {
			setIsLoading(true);
			const data = await getGameHistory(activeYear);
			setHistoryData(data);
		} catch (error) {
			console.error("Error fetching history data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, [activeYear]);

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			<hr className="border-slate-200 dark:border-zinc-800 border-[1px] w-full mb-8"></hr>

			{/* TABLE CARD */}
			<div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md p-6">
				{/* Header Toolbar */}
				<div className="flex flex-col sm:flex-row w-full justify-between sm:items-center pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800 gap-4">
					<div>
						<h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-indigo-500" />
							Game History Stats
						</h2>
						<p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
							Past session champions, game topics, and correct answer tallies
						</p>
					</div>

					{/* Sliding Year Capsule */}
					<div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto">
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
								{year} Games
								{activeYear === year && (
									<motion.span
										layoutId="activeHistoryYearIndicator"
										className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"
									/>
								)}
							</button>
						))}
					</div>
				</div>

				{/* Table Grid */}
				{isLoading ? (
					<div className="py-8 text-center text-slate-500">Loading history...</div>
				) : historyData.length === 0 ? (
					<div className="py-12 text-center text-slate-400 font-medium">
						No completed games recorded in {activeYear} yet.
					</div>
				) : (
					<div className="overflow-x-auto rounded-xl">
						<Table>
							<TableHeader className="bg-slate-50 dark:bg-zinc-900">
								<TableRow>
									<TableHead className="w-[140px] font-bold text-slate-700 dark:text-zinc-300">
										Date
									</TableHead>
									<TableHead className="font-bold text-slate-700 dark:text-zinc-300">
										Winner
									</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">
										Topic
									</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">
										Round 1 (5x)
									</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">
										Round 2 (10x)
									</TableHead>
									<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">
										Round 3 (15x)
									</TableHead>
									<TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">
										Winning Points
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<AnimatePresence mode="wait">
									{historyData.map((team, index) => (
										<TableRow
											key={`${activeYear}-history-${index}`}
											className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors"
										>
											<TableCell className="font-semibold text-sm text-slate-600 dark:text-zinc-400 py-3 align-middle">
												{team.date}
											</TableCell>
											<TableCell className="flex items-center gap-3 py-3 align-middle">
												<Avatar className="h-8 w-8 border border-slate-200 dark:border-zinc-800 shadow-sm">
													<AvatarImage src={team.avatar} alt={team.name} />
													<AvatarFallback className="font-bold bg-slate-200 dark:bg-zinc-800 text-[10px] text-slate-700 dark:text-zinc-300">
														{team.name.substring(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<span className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-1">
													{team.name}
													{index === 0 && activeYear === "2026" && (
														<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wide flex items-center gap-0.5">
															🏆 Reigning
														</span>
													)}
												</span>
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400 font-semibold italic text-xs">
												{team.topic}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-500 dark:text-zinc-500 text-sm">
												{team.round1}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-500 dark:text-zinc-500 text-sm">
												{team.round2}
											</TableCell>
											<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-500 dark:text-zinc-500 text-sm">
												{team.round3}
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
		</div>
	);
};

export default History;
