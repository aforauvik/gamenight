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
	return this.round1 * 5 + this.round2 * 10 + this.round3 * 15;
}

const allTeams = [
	{
		date: "Mar 04, 2025",
		name: "Landon",
		topic: "Guess The Movie From A Quote",
		avatar: "/landon.jpeg",
		round1: 7,
		round2: 5,
		round3: 8,
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
		get points() {
			return calculatePoints.call(this);
		},
	},
];

const History = () => {
	return (
		<div className="flex flex-col items-start justify-center px-4 lg:px-40 py-8">
			<h1 className="text-base font-regular text-left mb-4">Game Stats</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[120px]">Date</TableHead>
						<TableHead>Winner</TableHead>
						<TableHead className="text-right hidden sm:table-cell">
							Topic
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
					{allTeams.map((team, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium">{team.date}</TableCell>
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
								{team.topic}
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

export default History;
