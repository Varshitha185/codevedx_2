let userAnswers = [];
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

    userAnswers.push(selected.value);

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

        showResults();
    }
}

function showResults() {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    const percentage =
        Math.round(
            (score / currentQuiz.questions.length) * 100
        );

    let reviewHTML = "";

    currentQuiz.questions.forEach((question, index) => {

        const userAnswer =
            userAnswers[index];

        const isCorrect =
            userAnswer ===
            question.correctAnswer;

        let optionsHTML = "";

        question.options.forEach(option => {

            let className = "";

            if (
                option === userAnswer &&
                isCorrect
            ) {
                className = "correct";
            }

            else if (
                option === userAnswer &&
                !isCorrect
            ) {
                className = "wrong";
            }

            else if (
                option === question.correctAnswer
            ) {
                className = "correct";
            }

            optionsHTML += `
                <p class="${className}">
                    ${option}
                </p>
            `;
        });

        reviewHTML += `
            <div class="review-card">

                <h3>
                    ${index + 1}. ${question.question}
                </h3>

                ${optionsHTML}

            </div>
        `;
    });

    document.getElementById(
        "questionContainer"
    ).innerHTML = `

        <div class="progress-circle">

    <svg width="220" height="220">

        <circle
            cx="110"
            cy="110"
            r="90"
            class="bg-circle"
        ></circle>

        <circle
            cx="110"
            cy="110"
            r="90"
            class="progress-ring"
            style="
                stroke-dashoffset:
                ${565 - (565 * percentage / 100)}px
            "
        ></circle>

    </svg>

    <div class="percentage">
        ${percentage}%
    </div>

</div>

<h2>
    Score:
    ${score}
    /
    ${currentQuiz.questions.length}
</h2>

${reviewHTML}

</div>

    `;
}

loadQuiz();