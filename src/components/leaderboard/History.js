"use client";

import React from "react";
import {BookOpen, Sparkles} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

import {Button} from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

function calculatePoints() {
	return this.round1 * 5 + this.round2 * 10 + this.round3 * 15 + this.bonus;
}

const data2026 = [
	{
		date: "May 26, 2026",
		name: "Aunt Sabrina",
		topic: "New York Facts",
		avatar: "/aunt-sabrina.webp",
		round1: 10,
		round2: 4,
		round3: 6,
		bonus: 11,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "May 19, 2026",
		name: "Hannah",
		topic: "North Carolina Facts",
		avatar: "/hannah.jpeg",
		round1: 7,
		round2: 7,
		round3: 7,
		bonus: 7,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 28, 2026",
		name: "Hannah",
		topic: "US States",
		avatar: "/hannah.jpeg",
		round1: 9,
		round2: 5,
		round3: 4,
		bonus: 5,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Mar 31, 2026",
		name: "Grandma",
		topic: "General Knowledge",
		avatar: "/grandma.webp",
		round1: 10,
		round2: 7,
		round3: 4,
		bonus: 11,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Mar 24, 2026",
		name: "Grandma",
		topic: "General Knowledge",
		avatar: "/grandma.webp",
		round1: 10,
		round2: 6,
		round3: 4,
		bonus: 8,
		get points() {
			return calculatePoints.call(this);
		},
	},
];

const data2025 = [
	{
		date: "Dec 02, 2025",
		name: "Julian",
		topic: "Space Facts II",
		avatar: "/julian.jpeg",
		round1: 9,
		round2: 7,
		round3: 9,
		bonus: 16,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Oct 28, 2025",
		name: "Hannah",
		topic: "Space Facts I",
		avatar: "/hannah.jpeg",
		round1: 9,
		round2: 9,
		round3: 8,
		bonus: 16,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Oct 14, 2025",
		name: "Christine",
		topic: "World War II",
		avatar: "/christine.jpeg",
		round1: 6,
		round2: 5,
		round3: 2,
		bonus: 2,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Oct 07, 2025",
		name: "Hannah",
		topic: "Sitcom Showdown",
		avatar: "/hannah.jpeg",
		round1: 10,
		round2: 5,
		round3: 4,
		bonus: 8,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Sep 16, 2025",
		name: "Mom",
		topic: "Continental Showdown",
		avatar: "/mom.webp",
		round1: 10,
		round2: 9,
		round3: 5,
		bonus: 14,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Aug 12, 2025",
		name: "Hannah",
		topic: "Health Insurance",
		avatar: "/hannah.jpeg",
		round1: 8,
		round2: 8,
		round3: 9,
		bonus: 21,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Aug 05, 2025",
		name: "Christine",
		topic: "TV Facts",
		avatar: "/christine.jpeg",
		round1: 10,
		round2: 4,
		round3: 7,
		bonus: 13,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jul 22, 2025",
		name: "Grandma",
		topic: "Interesting Word Records",
		avatar: "/grandma.webp",
		round1: 4,
		round2: 4,
		round3: 6,
		bonus: 2,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jul 15, 2025",
		name: "Aunt Sabrina",
		topic: "Words That Meant Something Else",
		avatar: "/aunt-sabrina.webp",
		round1: 4,
		round2: 5,
		round3: 3,
		bonus: 1,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jul 08, 2025",
		name: "Hannah",
		topic: "Disney Cartoon",
		avatar: "/hannah.jpeg",
		round1: 9,
		round2: 7,
		round3: 8,
		bonus: 9,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jul 1, 2025",
		name: "Julian",
		topic: "True or False - Tech Edition",
		avatar: "/julian.jpeg",
		round1: 5,
		round2: 7,
		round3: 8,
		bonus: 3,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jun 10, 2025",
		name: "Hannah",
		topic: "Super Hero Showdown",
		avatar: "/hannah.jpeg",
		round1: 8,
		round2: 6,
		round3: 4,
		bonus: 4,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "June 03, 2025",
		name: "Christine",
		topic: "Modern Day Pop Culture",
		avatar: "/christine.jpeg",
		round1: 9,
		round2: 6,
		round3: 4,
		bonus: 7,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "May 29, 2025",
		name: "Christine",
		topic: "Guess The Person",
		avatar: "/christine.jpeg",
		round1: 22,
		round2: 36,
		round3: 15,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 29, 2025",
		name: "Hannah",
		topic: "Learn About Asia",
		avatar: "/hannah.jpeg",
		round1: 5,
		round2: 7,
		round3: 7,
		bonus: 3,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 22, 2025",
		name: "Christine",
		topic: "Learn About Africa",
		avatar: "/christine.jpeg",
		round1: 8,
		round2: 4,
		round3: 3,
		bonus: 3,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 15, 2025",
		name: "Landon",
		topic: "Space Facts",
		avatar: "/landon.jpeg",
		round1: 10,
		round2: 3,
		round3: 9,
		bonus: 2,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 8, 2025",
		name: "Grandma",
		topic: "Animal Facts",
		avatar: "/grandma.webp",
		round1: 9,
		round2: 6,
		round3: 8,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Apr 1, 2025",
		name: "Hannah",
		topic: "Food Facts",
		avatar: "/hannah.jpeg",
		round1: 9,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Mar 25, 2025",
		name: "Christine",
		topic: "Facts About US States",
		avatar: "/christine.jpeg",
		round1: 7,
		round2: 4,
		round3: 4,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Mar 04, 2025",
		name: "Landon",
		topic: "Guess The Movie From A Quote",
		avatar: "/landon.jpeg",
		round1: 7,
		round2: 4,
		round3: 4,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Feb 25, 2025",
		name: "Julian",
		topic: "Riddle Night",
		avatar: "/julian.jpeg",
		round1: 5,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Feb 18, 2025",
		name: "Hannah",
		topic: "Guess The Logo",
		avatar: "/hannah.jpeg",
		round1: 5,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Feb 11, 2025",
		name: "Grandma",
		topic: "True Or False",
		avatar: "/grandma.webp",
		round1: 5,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jan 21, 2025",
		name: "Aunt Sabrina",
		topic: "American History",
		avatar: "/aunt-sabrina.webp",
		round1: 5,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		date: "Jan 14, 2025",
		name: "Aunt Sabrina",
		topic: "Pop Culture",
		avatar: "/aunt-sabrina.webp",
		round1: 5,
		round2: 5,
		round3: 7,
		bonus: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
];

const historyData = {
	2026: data2026,
	2025: data2025,
};

const History = () => {
	const [activeYear, setActiveYear] = React.useState("2026");
	const activeData = historyData[activeYear] || [];

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			{/* Divider */}
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
								{activeData.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center py-8 text-zinc-500"
										>
											No games recorded in {activeYear} yet.
										</TableCell>
									</TableRow>
								) : (
									activeData.map((team, index) => (
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
									))
								)}
							</AnimatePresence>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default History;
