let currentQuestionIndex = 0;
let score = 0;
let currentQuiz;
const params =
    new URLSearchParams(window.location.search);

const quizId =
    params.get("id");

async function loadQuiz() {

    const response =
        await fetch(`/api/quizzes/${quizId}`);

    currentQuiz =
    await response.json();

    document.getElementById("quizTitle")
    .innerText = currentQuiz.title;

    // const questionContainer =
    //     document.getElementById("questionContainer");

    showQuestion();

    questionContainer.innerHTML = `
        <h2>${firstQuestion.question}</h2>

        ${firstQuestion.options.map(option => `
            <div>
                <input
                    type="radio"
                    name="answer"
                    value="${option}"
                >

                ${option}
            </div>
        `).join("")}
    `;
}

function showQuestion() {

    const question =
        currentQuiz.questions[currentQuestionIndex];

    const questionContainer =
        document.getElementById("questionContainer");

    questionContainer.innerHTML = `
        <h2>${question.question}</h2>

        ${question.options.map(option => `
            <div>
                <input
                    type="radio"
                    name="answer"
                    value="${option}"
                >
                ${option}
            </div>
        `).join("")}

        <br>

        <button onclick="nextQuestion()">
            ${currentQuestionIndex === currentQuiz.questions.length - 1
                ? "Submit Quiz"
                : "Next"}
        </button>
    `;
}

function nextQuestion() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (!selected) {

        alert("Please select an answer");

        return;
    }

    const currentQuestion =
        currentQuiz.questions[currentQuestionIndex];

    if (
        selected.value ===
        currentQuestion.correctAnswer
    ) {
        score++;
    }

    currentQuestionIndex++;

    if (
        currentQuestionIndex <
        currentQuiz.questions.length
    ) {

        showQuestion();

    } else {

        document.getElementById(
            "questionContainer"
        ).innerHTML = `
            <h2>Quiz Completed!</h2>

            <h3>
                Your Score:
                ${score} /
                ${currentQuiz.questions.length}
            </h3>
        `;
    }
}

loadQuiz();