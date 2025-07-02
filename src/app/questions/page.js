"use client";

import {useState, useEffect} from "react";
import QuestionCard from "./components/QuestionCard";
import {quizData} from "./data";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {updateViewPage} from "./utils/quizState";

export default function QuestionsPage() {
	const [currentRound, setCurrentRound] = useState(1);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	// const [score, setScore] = useState(0);
	const [showResults, setShowResults] = useState(false);
	const [answeredQuestions, setAnsweredQuestions] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);

	const currentRoundData = quizData[`round${currentRound}`];
	const currentQuestion = currentRoundData[currentQuestionIndex];
	const isFirstQuestion = currentRound === 1 && currentQuestionIndex === 0;
	const isLastQuestion =
		currentRound === 3 && currentQuestionIndex === currentRoundData.length - 1;

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
			<div className="max-w-4xl mx-auto">
				<div className="mb-2">
					<div>
						<CardTitle className="text-center text-3xl">
							Round {currentRound}
						</CardTitle>
					</div>
					<CardContent className="text-center">
						<p className="text-gray-600">
							Question {currentQuestionIndex + 1} of {currentRoundData.length}
						</p>
						{/* <p className="text-lg font-semibold mt-2">Score: {score}</p> */}
					</CardContent>
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
