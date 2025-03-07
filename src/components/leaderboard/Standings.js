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
import {ModeToggle} from "../mode-toggler";

const allInfo = {
	gameName: "Guess The Movie From A Quote",
	season: "Feb, 2025",
	rounds: 30,
};

function calculatePoints() {
	return this.round1 * 5 + this.round2 * 10 + this.round3 * 15;
}

const allTeams = [
	{
		name: "Grandma",
		avatar: "/grandma.webp",
		played: allInfo.rounds,
		round1: 8,
		round2: 7,
		round3: 4,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Aunt Sabrina",
		avatar: "/aunt-sabrina.webp",
		played: allInfo.rounds,
		round1: 0,
		round2: 0,
		round3: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Mom",
		avatar: "/mom.webp",
		played: allInfo.rounds,
		round1: 9,
		round2: 6,
		round3: 4,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Hannah",
		avatar: "/hannah.jpeg",
		played: allInfo.rounds,
		round1: 9,
		round2: 7,
		round3: 4,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Julian",
		avatar: "/julian.jpeg",
		played: allInfo.rounds,
		round1: 0,
		round2: 0,
		round3: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Landon",
		avatar: "/landon.jpeg",
		played: allInfo.rounds,
		round1: 7,
		round2: 5,
		round3: 8,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Christine",
		avatar: "/christine.jpeg",
		played: allInfo.rounds,
		round1: 9,
		round2: 6,
		round3: 3,
		get points() {
			return calculatePoints.call(this);
		},
	},
];

const sortedTeams = allTeams
	.map((team) => ({...team}))
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
		<div className="flex flex-col items-start justify-center px-4 lg:px-40 py-4">
			<hr className="border-zinc-100 border-[1px] w-full mb-4"></hr>
			<div className="flex lg:flex-row flex-col lg:items-center items-start justify-between w-full">
				<h1 className="lg:text-xl text-base font-bold text-left lg:mb-4 mb-1">
					Family Gaming League
				</h1>
				<div className="flex lg:flex-row justify-center items-center gap-2">
					<p className="lg:text-base text-sm font-semibold text-right text-zinc-500 mb-4">
						{" "}
						{allInfo.gameName}
					</p>

					{/* <p className="lg:text-base text-sm font-semibold text-right mb-4">
						<ModeToggle />
					</p> */}
				</div>
			</div>

			<hr className="border-zinc-100 border-[1px] w-full mb-4"></hr>

			<h1 className="text-base font-normal text-left mb-4">Scoreboard</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[120px]">Rank</TableHead>
						<TableHead>Player</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Questions
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Round 1
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Round 2
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Round 3
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
								{team.played}
							</TableCell>
							<TableCell className="text-right hidden sm:table-cell">
								{team.round1}
							</TableCell>
							<TableCell className="text-right hidden sm:table-cell">
								{team.round2}
							</TableCell>
							<TableCell className="text-right hidden sm:table-cell">
								{team.round3}
							</TableCell>
							<TableCell className="text-right">{team.points}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default Standings;
