"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const QuestionCard = ({
	question,
	onAnswer,
	onNext,
	onPrevious,
	isFirstQuestion,
	isLastQuestion,
	selectedOption,
	onOptionClick,
	showAnswer,
	onRevealAnswer,
}) => {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">
					{question.question}
					{showAnswer && (
						<div className="text-lg font-semibold mt-2">
							{selectedOption === question.correctAnswer ? (
								<div>
									<span className="text-green-600">Correct! 🎉</span>
									<p className="text-gray-600 text-base font-normal mt-2">
										{question.description}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									<span className="text-red-600 block">
										Incorrect. The correct answer is: {question.correctAnswer}
									</span>
									<p className="text-gray-600 text-base font-normal mt-2">
										{question.description}
									</p>
								</div>
							)}
						</div>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 mb-6">
					{question.options.map((option, index) => (
						<Button
							key={index}
							onClick={() => onOptionClick(option)}
							variant={selectedOption === option ? "default" : "outline"}
							className="w-full justify-start h-auto py-4 text-lg"
						>
							{option}
						</Button>
					))}
				</div>

				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						<Button
							onClick={onPrevious}
							disabled={isFirstQuestion}
							variant="outline"
						>
							Previous
						</Button>
						<Button
							onClick={onNext}
							disabled={isLastQuestion}
							variant="outline"
						>
							Next
						</Button>
					</div>

					<Button
						onClick={onRevealAnswer}
						disabled={!selectedOption || showAnswer}
						variant="default"
					>
						Reveal Answer
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default QuestionCard;
