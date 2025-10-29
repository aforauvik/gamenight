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
	return this.round1 * 5 + this.round2 * 10 + this.round3 * 15 + this.bonus;
}

const allTeams = [
	{
		date: "Oct 28, 2025",
		name: "Hannah",
		topic: "Space Facts",
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
