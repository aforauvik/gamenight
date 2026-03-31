"use client";

import React from "react";

import {Button} from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import Image from "next/image";
import {RankingGraph} from "./RankingGraph";
import {StandingGraph} from "./StandingGraph";

import { allInfo2025, allInfo2026, rawTeams2025, rawTeams2026 } from "./data";

export const allInfo = allInfo2025;

export const allTeams = rawTeams2025.map((team) => ({
	...team,
	game: allInfo2025.game,
	points: team.first * 3 + team.second * 2 + team.third * 1,
}));

const allTeams2026 = rawTeams2026.map((team) => ({
	...team,
	game: allInfo2026.game,
	points: team.first * 3 + team.second * 2 + team.third * 1,
}));

const leaderboardData = {
	"2026": {
		teams: allTeams2026,
		totalGames: allInfo2026.game,
	},
	"2025": {
		teams: allTeams,
		totalGames: allInfo2025.game,
	},
};

function getRankColor(rank) {
	if (rank === 1) {
		return "bg-emerald-200 dark:bg-emerald-500/9";
	} else if (rank === 2) {
		return "bg-emerald-100 dark:bg-emerald-500/7";
	} else if (rank === 3) {
		return "bg-emerald-50 dark:bg-emerald-500/5";
	} else {
		return "";
	}
}

const Standings = () => {
	const [activeYear, setActiveYear] = React.useState("2026");
	const { teams: activeData, totalGames } = leaderboardData[activeYear];

	const sortedTeams = [...activeData]
		.sort((a, b) => b.points - a.points)
		.map((team, index) => ({...team, rank: index + 1}));

	return (
		<>
			<div className="flex flex-col items-start justify-center px-4 lg:px-40 py-4">
				<div className="flex flex-row w-full justify-between items-center mb-4">
					<h1 className="text-base font-normal text-left mb-4">Leaderboard</h1>
					<div className="flex gap-2">
						<Button 
							variant={activeYear === "2026" ? "default" : "outline"} 
							onClick={() => setActiveYear("2026")}
						>
							2026
						</Button>
						<Button 
							variant={activeYear === "2025" ? "default" : "outline"} 
							onClick={() => setActiveYear("2025")}
						>
							2025
						</Button>
					</div>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px]">Rank</TableHead>
							<TableHead>Player</TableHead>
							<TableHead className="text-right hidden sm:table-cell">
								Game
							</TableHead>
							<TableHead className="text-right hidden sm:table-cell">
								1st
							</TableHead>
							<TableHead className="text-right hidden sm:table-cell">
								2nd
							</TableHead>
							<TableHead className="text-right hidden sm:table-cell">
								3rd
							</TableHead>
							<TableHead className="text-right">Points</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedTeams.map((team, index) => (
							<TableRow key={index} className={getRankColor(team.rank)}>
								<TableCell className="font-medium">
									{String(team.rank).padStart(2, "0")}
								</TableCell>
								<TableCell className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={team.avatar} alt={team.name} />
										<AvatarFallback>
											{team.name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									{team.name}
								</TableCell>
								<TableCell className="text-right hidden sm:table-cell">
									{team.game}
								</TableCell>
								<TableCell className="text-right hidden sm:table-cell">
									{team.first}
								</TableCell>
								<TableCell className="text-right hidden sm:table-cell">
									{team.second}
								</TableCell>
								<TableCell className="text-right hidden sm:table-cell">
									{team.third}
								</TableCell>
								<TableCell className="text-right">{team.points}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex lg:flex-row flex-col justify-center gap-4 w-full lg:px-40 py-4 px-4">
				<RankingGraph data={activeData} year={activeYear} />
				<StandingGraph data={activeData} year={activeYear} totalGames={totalGames} />
			</div>
		</>
	);
};

export default Standings;
