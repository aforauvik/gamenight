"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Sparkles, Gamepad2, Flame } from "lucide-react";

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

import { allInfo2026 as allInfo, rawTeams2026 as rawTeams } from "./data";

const allTeams = rawTeams.map((team) => ({
	...team,
	played: allInfo.rounds,
	points: team.round1 * 5 + team.round2 * 10 + team.round3 * 15 + team.bonus,
}));

const sortedTeams = allTeams
	.sort((a, b) => b.points - a.points)
	.map((team, index) => ({ ...team, rank: index + 1 }));

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
	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-6">
			{/* Top divider */}
			<hr className="border-slate-200 dark:border-zinc-800 border-[1px] w-full mb-6"></hr>

			{/* HEADER TOOLBAR */}
			<div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-6 gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<Trophy className="h-6 w-6 text-amber-500 animate-bounce" />
						<h1 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">
							Family Gaming League
						</h1>
					</div>
					<p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
						<Sparkles className="h-4 w-4" />
						Active Season: {allInfo.season}
					</p>
				</div>

				<div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
					<div className="text-left md:text-right">
						<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500 block">Current Game</span>
						<p className="text-sm font-extrabold text-slate-700 dark:text-zinc-300 truncate max-w-[200px]">
							{allInfo.gameName}
						</p>
					</div>

					<div className="flex gap-2">
						<Link href="/calc" target="_blank">
							<Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-slate-200 text-slate-700 hover:text-indigo-600 gap-1.5 hover:bg-indigo-50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-800">
								<Gamepad2 className="h-4 w-4 text-indigo-500" />
								<span>Calc Sheet</span>
							</Button>
						</Link>

						<Link href="/powerups" target="_blank">
							<Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-slate-200 text-slate-700 hover:text-amber-500 gap-1.5 hover:bg-amber-50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-800">
								<Flame className="h-4 w-4 text-amber-500" />
								<span>Powerups</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<hr className="border-slate-200 dark:border-zinc-800 border-[1px] w-full mb-6"></hr>

			{/* STANDINGS TABLE */}
			<div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md p-4">
				<h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-4 px-2">
					Season Standings
				</h3>

				<div className="overflow-x-auto rounded-xl">
					<Table>
						<TableHeader className="bg-slate-50 dark:bg-zinc-900">
							<TableRow>
								<TableHead className="w-[120px] font-bold text-slate-700 dark:text-zinc-300">Rank</TableHead>
								<TableHead className="font-bold text-slate-700 dark:text-zinc-300">Player</TableHead>
								<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Questions</TableHead>
								<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 1 (5x)</TableHead>
								<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 2 (10x)</TableHead>
								<TableHead className="text-right hidden sm:table-cell font-bold text-slate-700 dark:text-zinc-300">Round 3 (15x)</TableHead>
								<TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">Total Points</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedTeams.map((team, index) => (
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
									<TableCell className="text-right hidden sm:table-cell py-3 align-middle text-slate-600 dark:text-zinc-400 font-semibold">
										{team.played}
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
									<TableCell className="text-right py-3 align-middle font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
										{team.points}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Standings;
