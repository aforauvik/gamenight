"use client";

import React, {useState, useEffect} from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Check, X, RotateCcw, RefreshCw} from "lucide-react";
import {allTeams} from "@/components/leaderboard/Leaderboard";
import {Button} from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "pointCalculationScores";

const initialScores = allTeams.map((player) => ({
	name: player.name,
	avatar: player.avatar,
	rounds: [
		{
			questions: Array(10).fill(null),
			bonusPoints: 0,
		},
		{
			questions: Array(10).fill(null),
			bonusPoints: 0,
		},
		{
			questions: Array(10).fill(null),
			bonusPoints: 0,
		},
	],
}));

const PointCalculation = () => {
	const [playerScores, setPlayerScores] = useState(initialScores);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		const savedScores = localStorage.getItem(STORAGE_KEY);
		if (savedScores) {
			setPlayerScores(JSON.parse(savedScores));
		}
	}, []);

	useEffect(() => {
		if (isClient) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(playerScores));
		}
	}, [playerScores, isClient]);

	const handleAnswer = (playerIndex, roundIndex, questionIndex, isCorrect) => {
		setPlayerScores((prevScores) => {
			const newScores = [...prevScores];
			const player = {...newScores[playerIndex]};
			const round = {...player.rounds[roundIndex]};
			const questions = [...round.questions];

			questions[questionIndex] = isCorrect;

			// Calculate bonus points
			let consecutiveCorrect = 0;
			let bonusPoints = 0;
			let isBonusActive = false;

			for (let i = 0; i < questions.length; i++) {
				if (questions[i] === true) {
					consecutiveCorrect++;
					if (consecutiveCorrect >= 3) {
						isBonusActive = true;
					}
					if (isBonusActive) {
						bonusPoints++;
					}
				} else {
					consecutiveCorrect = 0;
					isBonusActive = false;
				}
			}

			round.questions = questions;
			round.bonusPoints = bonusPoints;
			player.rounds[roundIndex] = round;
			newScores[playerIndex] = player;

			return newScores;
		});
	};

	const resetAnswer = (playerIndex, roundIndex, questionIndex) => {
		setPlayerScores((prevScores) => {
			const newScores = [...prevScores];
			const player = {...newScores[playerIndex]};
			const round = {...player.rounds[roundIndex]};
			const questions = [...round.questions];

			questions[questionIndex] = null;

			// Recalculate bonus points
			let consecutiveCorrect = 0;
			let bonusPoints = 0;
			let isBonusActive = false;

			for (let i = 0; i < questions.length; i++) {
				if (questions[i] === true) {
					consecutiveCorrect++;
					if (consecutiveCorrect >= 3) {
						isBonusActive = true;
					}
					if (isBonusActive) {
						bonusPoints++;
					}
				} else {
					consecutiveCorrect = 0;
					isBonusActive = false;
				}
			}

			round.questions = questions;
			round.bonusPoints = bonusPoints;
			player.rounds[roundIndex] = round;
			newScores[playerIndex] = player;

			return newScores;
		});
	};

	const resetAllScores = () => {
		setPlayerScores(initialScores);
	};

	const calculateTotalPoints = (player) => {
		return player.rounds.reduce((total, round) => {
			const correctAnswers = round.questions.filter((q) => q === true).length;
			return total + correctAnswers;
		}, 0);
	};

	const calculateRoundPoints = (round) => {
		const correctAnswers = round.questions.filter((q) => q === true).length;
		return correctAnswers;
	};

	const calculateTotalBonusPoints = (player) => {
		return player.rounds.reduce((total, round) => total + round.bonusPoints, 0);
	};

	if (!isClient) {
		return null; // or a loading state
	}

	return (
		<div className="w-full px-2 py-4">
			<div className="flex justify-between items-center mb-6 px-2">
				<h1 className="text-2xl font-bold">Point Calculation</h1>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline" className="gap-2">
							<RefreshCw className="h-4 w-4" />
							Reset All Scores
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Reset All Scores</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to reset all scores? This action cannot be
								undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={resetAllScores}>
								Reset
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			{[0, 1, 2].map((roundIndex) => (
				<div key={roundIndex} className="w-full mb-8">
					<h2 className="text-xl font-bold mb-4 px-2">
						Round {roundIndex + 1}
					</h2>

					<div className="w-full overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[150px] min-w-[150px]">
										Player
									</TableHead>
									{Array.from({length: 10}, (_, i) => (
										<TableHead
											key={i}
											className="text-center w-[60px] min-w-[60px]"
										>
											Q{i + 1}
										</TableHead>
									))}
									<TableHead className="text-center w-[100px] min-w-[100px]">
										Bonus
									</TableHead>
									<TableHead className="text-center w-[100px] min-w-[100px]">
										Correct
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{playerScores.map((player, playerIndex) => (
									<TableRow key={player.name}>
										<TableCell className="w-[150px] min-w-[150px]">
											<div className="flex items-center gap-2">
												<Avatar className="h-8 w-8">
													<AvatarImage src={player.avatar} alt={player.name} />
													<AvatarFallback>
														{player.name.substring(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium truncate">
													{player.name}
												</span>
											</div>
										</TableCell>

										{player.rounds[roundIndex].questions.map(
											(answer, questionIndex) => (
												<TableCell
													key={questionIndex}
													className="text-center w-[60px] min-w-[60px]"
												>
													{answer === null ? (
														<div className="flex justify-center gap-1">
															<button
																onClick={() =>
																	handleAnswer(
																		playerIndex,
																		roundIndex,
																		questionIndex,
																		true
																	)
																}
																className="p-1 hover:bg-green-100 rounded"
															>
																<Check className="h-4 w-4 text-green-500" />
															</button>
															<button
																onClick={() =>
																	handleAnswer(
																		playerIndex,
																		roundIndex,
																		questionIndex,
																		false
																	)
																}
																className="p-1 hover:bg-red-100 rounded"
															>
																<X className="h-4 w-4 text-red-500" />
															</button>
														</div>
													) : (
														<button
															onClick={() =>
																resetAnswer(
																	playerIndex,
																	roundIndex,
																	questionIndex
																)
															}
															className="p-1 hover:bg-gray-100 rounded group relative"
														>
															{answer ? (
																<Check className="h-4 w-4 text-green-500" />
															) : (
																<X className="h-4 w-4 text-red-500" />
															)}
															<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
																<RotateCcw className="h-3 w-3 text-gray-500" />
															</div>
														</button>
													)}
												</TableCell>
											)
										)}

										<TableCell className="text-center font-medium w-[100px] min-w-[100px]">
											{player.rounds[roundIndex].bonusPoints}
										</TableCell>

										<TableCell className="text-center font-bold w-[100px] min-w-[100px]">
											{calculateRoundPoints(player.rounds[roundIndex])}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			))}

			<div className="w-full mt-8">
				<h2 className="text-xl font-bold mb-4 px-2">Total Scores</h2>
				<div className="w-full overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[150px] min-w-[150px]">
									Player
								</TableHead>
								<TableHead className="text-center w-[100px] min-w-[100px]">
									Round 1
								</TableHead>
								<TableHead className="text-center w-[100px] min-w-[100px]">
									Round 2
								</TableHead>
								<TableHead className="text-center w-[100px] min-w-[100px]">
									Round 3
								</TableHead>
								<TableHead className="text-center w-[100px] min-w-[100px]">
									Bonus
								</TableHead>
								<TableHead className="text-center w-[100px] min-w-[100px]">
									Total
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{playerScores.map((player) => (
								<TableRow key={player.name}>
									<TableCell className="w-[150px] min-w-[150px]">
										<div className="flex items-center gap-2">
											<Avatar className="h-8 w-8">
												<AvatarImage src={player.avatar} alt={player.name} />
												<AvatarFallback>
													{player.name.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="font-medium truncate">
												{player.name}
											</span>
										</div>
									</TableCell>
									{player.rounds.map((round, index) => (
										<TableCell
											key={index}
											className="text-center w-[100px] min-w-[100px]"
										>
											{calculateRoundPoints(round)}
										</TableCell>
									))}
									<TableCell className="text-center font-medium w-[100px] min-w-[100px]">
										{calculateTotalBonusPoints(player)}
									</TableCell>
									<TableCell className="text-center font-bold w-[100px] min-w-[100px]">
										{calculateTotalPoints(player)}
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

export default PointCalculation;
