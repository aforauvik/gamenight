"use client";

import {useState, useEffect, useRef} from "react";
import QuestionCard from "./components/QuestionCard";
import {quizData} from "./data";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {updateViewPage} from "./utils/quizState";
import {X} from "lucide-react";

export default function QuestionsPage() {
	const [currentRound, setCurrentRound] = useState(1);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	// const [score, setScore] = useState(0);
	const [showResults, setShowResults] = useState(false);
	const [answeredQuestions, setAnsweredQuestions] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);

	// Timer state
	const [timer, setTimer] = useState(0);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const bonusSoundRef = useRef(null);
	const tickSoundRef = useRef(null);
	const timeUpSoundRef = useRef(null);
	const timerIntervalRef = useRef(null);
	const hasPlayedTickSound = useRef(false);

	const currentRoundData = quizData[`round${currentRound}`];
	const currentQuestion = currentRoundData[currentQuestionIndex];
	const isFirstQuestion = currentRound === 1 && currentQuestionIndex === 0;
	const isLastQuestion =
		currentRound === 3 && currentQuestionIndex === currentRoundData.length - 1;

	// Timer effects
	useEffect(() => {
		if (timer === 0 && isTimerRunning) {
			setIsTimerRunning(false);
			hasPlayedTickSound.current = false;
			if (timeUpSoundRef.current) {
				timeUpSoundRef.current.currentTime = 0;
				timeUpSoundRef.current.play().catch((error) => {
					console.log("Error playing time up sound:", error);
				});
			}
		} else if (timer === 7 && isTimerRunning && !hasPlayedTickSound.current) {
			if (tickSoundRef.current) {
				tickSoundRef.current.currentTime = 0;
				tickSoundRef.current.play().catch((error) => {
					console.log("Error playing tick sound:", error);
				});
				hasPlayedTickSound.current = true;
			}
		}
	}, [timer, isTimerRunning]);

	const startTimer = () => {
		if (isTimerRunning) return;

		setTimer(15);
		setIsTimerRunning(true);
		hasPlayedTickSound.current = false;

		timerIntervalRef.current = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					clearInterval(timerIntervalRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const stopTimer = () => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
		}
		setIsTimerRunning(false);
		setTimer(0);
		hasPlayedTickSound.current = false;
	};

	const playBonusSound = () => {
		if (bonusSoundRef.current) {
			bonusSoundRef.current.currentTime = 0;
			bonusSoundRef.current.play().catch((error) => {
				console.log("Error playing bonus sound:", error);
			});
		}
	};

	// Update view page whenever state changes
	useEffect(() => {
		const state = {
			currentRound,
			currentQuestionIndex,
			totalQuestions: currentRoundData.length,
			question: currentQuestion,
			selectedOption,
			showAnswer,
		};
		updateViewPage(state);
	}, [
		currentRound,
		currentQuestionIndex,
		currentQuestion,
		selectedOption,
		showAnswer,
		currentRoundData.length,
	]);

	const handleAnswer = (isCorrect) => {
		const questionId = currentQuestion.id;
		if (!answeredQuestions[questionId]) {
			// if (isCorrect) {
			//   setScore(score + 1);
			// }
			setAnsweredQuestions((prev) => ({
				...prev,
				[questionId]: true,
			}));
		}
	};

	const handleOptionClick = (option) => {
		setSelectedOption(option);
	};

	const handleRevealAnswer = () => {
		setShowAnswer(true);
		handleAnswer(selectedOption === currentQuestion.correctAnswer);
	};

	const handleNext = () => {
		setShowAnswer(false);
		setSelectedOption(null);
		if (currentQuestionIndex < currentRoundData.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else if (currentRound < 3) {
			setCurrentRound(currentRound + 1);
			setCurrentQuestionIndex(0);
		}
	};

	const handlePrevious = () => {
		setShowAnswer(false);
		setSelectedOption(null);
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		} else if (currentRound > 1) {
			setCurrentRound(currentRound - 1);
			setCurrentQuestionIndex(quizData[`round${currentRound - 1}`].length - 1);
		}
	};

	if (showResults) {
		return (
			<div className="min-h-screen bg-gray-100 py-12 px-4">
				<Card className="max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle className="text-3xl text-center">
							Quiz Complete! 🎉
						</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						{/* <p className="text-xl mb-6">Your final score: {score} out of 9</p> */}
						<Button
							onClick={() => {
								setCurrentRound(1);
								setCurrentQuestionIndex(0);
								// setScore(0);
								setShowResults(false);
								setAnsweredQuestions({});
								setSelectedOption(null);
								setShowAnswer(false);
							}}
							variant="default"
							size="lg"
						>
							Play Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-4 px-4">
			{/* Audio elements */}
			<audio ref={bonusSoundRef} src="/game-bonus.mp3" preload="auto" />
			<audio ref={tickSoundRef} src="/time-ticks.mp3" preload="auto" />
			<audio ref={timeUpSoundRef} src="/time-up.mp3" preload="auto" />

			<div className="max-w-4xl mx-auto">
				<div className="mb-2">
					<div className="flex justify-between items-center">
						<div className="flex-1">
							<CardTitle className="text-3xl">Round {currentRound}</CardTitle>
							<CardContent className="px-0">
								<p className="text-gray-600">
									Question {currentQuestionIndex + 1} of{" "}
									{currentRoundData.length}
								</p>
								{/* <p className="text-lg font-semibold mt-2">Score: {score}</p> */}
							</CardContent>
						</div>

						<div className="flex items-center">
							<Button
								onClick={isTimerRunning ? stopTimer : startTimer}
								variant={isTimerRunning ? "destructive" : "default"}
								className="gap-2"
							>
								{isTimerRunning ? (
									<>
										<span className="font-mono">{timer}s</span>
										<X className="h-4 w-4" />
									</>
								) : (
									<>
										<span>Start Timer</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-4 w-4"
										>
											<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
											<path d="M12 6v6l4 2" />
										</svg>
									</>
								)}
							</Button>
						</div>
					</div>
				</div>

				<Separator className="my-6" />

				<QuestionCard
					question={currentQuestion}
					onAnswer={handleAnswer}
					onNext={handleNext}
					onPrevious={handlePrevious}
					isFirstQuestion={isFirstQuestion}
					isLastQuestion={isLastQuestion}
					selectedOption={selectedOption}
					onOptionClick={handleOptionClick}
					showAnswer={showAnswer}
					onRevealAnswer={handleRevealAnswer}
				/>
			</div>
		</div>
	);
}
