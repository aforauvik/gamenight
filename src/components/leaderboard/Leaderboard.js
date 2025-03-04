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

function calculatePoints() {
	return this.first * 3 + this.second * 2 + this.third * 1;
}

const allTeams = [
	{
		name: "Grandma",
		avatar: "https://github.com/shadcn.png",
		played: 5,
		first: 2,
		second: 0,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Aunt Sabrina",
		avatar: "https://github.com/shadcn.png",
		played: 5,
		first: 3,
		second: 1,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Mom",
		avatar: "https://github.com/shadcn.png",
		played: 5,
		first: 0,
		second: 1,
		third: 1,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Hannah",
		avatar: "/hannah.jpeg",
		played: 5,
		first: 1,
		second: 3,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Julian",
		avatar: "/julian.jpeg",
		played: 5,
		first: 1,
		second: 0,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Landon",
		avatar: "/landon.jpeg",
		played: 5,
		first: 0,
		second: 1,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
	{
		name: "Christine",
		avatar: "/christine.jpeg",
		played: 5,
		first: 0,
		second: 0,
		third: 0,
		get points() {
			return calculatePoints.call(this);
		},
	},
];

const sortedTeams = allTeams
	.map((team) => ({...team}))
	.sort((a, b) => b.points - a.points)
	.map((team, index) => ({...team, rank: index + 1}));

const Standings = () => {
	return (
		<div className="flex flex-col items-start justify-center px-4 lg:px-40 py-4">
			<h1 className="text-base font-normal text-left mb-4">Leaderboard</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[120px]">Rank</TableHead>
						<TableHead>Player</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Played
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							1st
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							2nd
						</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							3rd{" "}
						</TableHead>
						<TableHead className="text-right">Points</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedTeams.map((team, index) => (
						<TableRow key={index}>
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
	);
};

export default Standings;
