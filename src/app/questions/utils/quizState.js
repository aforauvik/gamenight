// Create a custom event for quiz state updates
export const QUIZ_STATE_EVENT = "quizStateUpdate";

// Function to update the view page
export const updateViewPage = (state) => {
	const event = new CustomEvent(QUIZ_STATE_EVENT, {
		detail: state,
	});
	window.dispatchEvent(event);
};

// Function to initialize view page listeners
export const initializeViewPage = () => {
	window.addEventListener(QUIZ_STATE_EVENT, (event) => {
		console.log("Received state update:", event.detail); // Debug log
		const state = event.detail;

		// Update round and question numbers
		document.getElementById("current-round").textContent = state.currentRound;
		document.getElementById("current-question").textContent =
			state.currentQuestionIndex + 1;
		document.getElementById("total-questions").textContent =
			state.totalQuestions;

		// Update question text
		document.getElementById("question-text").textContent =
			state.question.question;

		// Update options
		const optionsContainer = document.getElementById("options-container");
		optionsContainer.innerHTML = state.question.options
			.map(
				(option, index) => `
			<div class="p-4 rounded-lg border-2 ${
				state.selectedOption === option
					? "border-blue-500 bg-blue-50"
					: "border-gray-200 bg-gray-50"
			}">
				${option}
			</div>
		`
			)
			.join("");

		// Update answer feedback if shown
		const answerFeedback = document.getElementById("answer-feedback");
		if (state.showAnswer) {
			answerFeedback.classList.remove("hidden");
			const correctAnswer = document.getElementById("correct-answer");
			const incorrectAnswer = document.getElementById("incorrect-answer");
			const answerDescription = document.getElementById("answer-description");

			if (state.selectedOption === state.question.correctAnswer) {
				correctAnswer.textContent = "Correct! 🎉";
				incorrectAnswer.textContent = "";
			} else {
				correctAnswer.textContent = "";
				incorrectAnswer.textContent = `Incorrect. The correct answer is: ${state.question.correctAnswer}`;
			}
			answerDescription.textContent = state.question.description;
		} else {
			answerFeedback.classList.add("hidden");
		}
	});
};
