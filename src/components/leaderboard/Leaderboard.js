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

export const allInfo = {
	game: 32,
};

export const allTeams = [
	{
		name: "Grandma",
		avatar: "/grandma.webp",
		game: allInfo.game,
		first: 4,
		second: 6,
		third: 2,
	},
	{
		name: "Aunt Sabrina",
		avatar: "/aunt-sabrina.webp",
		game: allInfo.game,
		first: 4,
		second: 4,
		third: 0,
	},
	{
		name: "Mom",
		avatar: "/mom.webp",
		game: allInfo.game,
		first: 1,
		second: 3,
		third: 6,
	},
	{
		name: "Hannah",
		avatar: "/hannah.jpeg",
		game: allInfo.game,
		first: 9,
		second: 10,
		third: 6,
	},
	{
		name: "Leif",
		avatar: "/leif.jpeg",
		game: allInfo.game,
		first: 0,
		second: 0,
		third: 0,
	},
	{
		name: "Julian",
		avatar: "/julian.jpeg",
		game: allInfo.game,
		first: 3,
		second: 3,
		third: 8,
	},
	{
		name: "Landon",
		avatar: "/landon.jpeg",
		game: allInfo.game,
		first: 2,
		second: 1,
		third: 1,
	},
	{
		name: "Christine",
		avatar: "/christine.jpeg",
		game: allInfo.game,
		first: 6,
		second: 3,
		third: 1,
	},
].map((team) => ({
	...team,
	points: team.first * 3 + team.second * 2 + team.third * 1,
}));

const sortedTeams = allTeams
	.sort((a, b) => b.points - a.points)
	.map((team, index) => ({...team, rank: index + 1}));

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
	return (
		<>
			<div className="flex flex-col items-start justify-center px-4 lg:px-40 py-4">
				<h1 className="text-base font-normal text-left mb-4">Leaderboard</h1>
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
				<RankingGraph />
				<StandingGraph />
			</div>
		</>
	);
};

export default Standings;
