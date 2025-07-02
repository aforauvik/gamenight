"use client";
import {useState} from "react";
import PowerUpCard from "./components/PowerUpCard";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Shuffle} from "lucide-react";

const powerUps = [
	{
		name: "Double Trouble",
		description:
			"Earn 2 bonus points on your next correct answer. If you're wrong, lose 2 bonus points.",
	},
	{
		name: "Answer Block",
		description: "Pick one player — they can't answer the next question.",
	},
	{
		name: "Sabotage",
		description:
			"Before the question, pick someone. If you answer correctly, steal 2 of their bonus points.",
	},
	{
		name: "Point Leech",
		description:
			"If you answer correctly, get 1 bonus point from every other player who also got it right.",
	},
	{
		name: "Baggage",
		description:
			"Before the question, choose one player. If both of you get the next question right, you both get double points! If one gets it wrong you both get -1",
	},
	{
		name: "Hacker",
		description:
			"Eliminate two wrong options if you have 4 options to choose from.",
	},
	{
		name: "Mirror Effect",
		description:
			"Before the question, pick someone. If you get it right, you earn 1 bonus point. If you get it wrong they get 1 bonus point",
	},
	{
		name: "Tag Team",
		description:
			"Before the question, team up with one player. If either of you get it right, you both earn 1 bonus point. If you both get it right, score 5 bonus points each!",
	},
	{
		name: "Point Snatch",
		description:
			"If you answer correctly, steal 1 point from every other player who got it wrong.",
	},
	{
		name: "Reveal Shield",
		description:
			"Use this to delay revealing your answer until after everyone else has shown theirs.",
	},
];

export default function PowerUpsPage() {
	const [shuffledPowerUps, setShuffledPowerUps] = useState([...powerUps]);

	const shuffleCards = () => {
		const shuffled = [...shuffledPowerUps];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		setShuffledPowerUps(shuffled);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center py-8">
			<div className="w-full max-w-7xl px-4">
				<div className="mb-8">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-xl">Power Ups</CardTitle>
						<Button
							onClick={shuffleCards}
							variant="outline"
							size="icon"
							className="h-10 w-10"
						>
							<Shuffle className="h-5 w-5" />
						</Button>
					</CardHeader>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 place-items-center">
					{shuffledPowerUps.map((powerUp, index) => (
						<PowerUpCard key={index} powerUp={powerUp} number={index + 1} />
					))}
				</div>
			</div>
		</div>
	);
}
