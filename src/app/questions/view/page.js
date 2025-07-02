"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {quizData} from "../data";
import {QUIZ_STATE_EVENT} from "../utils/quizState";

export default function ViewPage() {
	const [state, setState] = useState({
		currentRound: 1,
		currentQuestionIndex: 0,
		totalQuestions: 3,
		question: quizData.round1[0],
		selectedOption: null,
		showAnswer: false,
	});

	useEffect(() => {
		const handleStateUpdate = (event) => {
			console.log("View page received update:", event.detail);
			setState(event.detail);
		};

		window.addEventListener(QUIZ_STATE_EVENT, handleStateUpdate);
		return () => {
			window.removeEventListener(QUIZ_STATE_EVENT, handleStateUpdate);
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 py-4 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<div>
						<CardTitle className="text-center text-3xl">
							Round {state.currentRound}
						</CardTitle>
					</div>
					<CardContent className="text-center">
						<p className="text-gray-600">
							Question {state.currentQuestionIndex + 1} of{" "}
							{state.totalQuestions}
						</p>
					</CardContent>
				</div>

				<Separator className="my-6" />

				<Card className="max-w-2xl mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">
							{state.question.question}
							{state.showAnswer && (
								<div className="text-lg font-semibold mt-2">
									{state.selectedOption === state.question.correctAnswer ? (
										<div>
											<span className="text-green-600">Correct! 🎉</span>
											<p className="text-gray-600 text-base font-normal mt-2">
												{state.question.description}
											</p>
										</div>
									) : (
										<div className="space-y-2">
											<span className="text-red-600 block">
												Incorrect. The correct answer is:{" "}
												{state.question.correctAnswer}
											</span>
											<p className="text-gray-600 text-base font-normal mt-2">
												{state.question.description}
											</p>
										</div>
									)}
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 mb-6">
							{state.question.options.map((option, index) => (
								<div
									key={index}
									className={`p-4 rounded-lg border-2 ${
										state.selectedOption === option
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 bg-gray-50"
									}`}
								>
									{option}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
