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

        const progress =
    ((currentQuestionIndex + 1) /
    currentQuiz.questions.length) * 100;

document.getElementById(
    "progressBar"
).style.width = `${progress}%`;

document.getElementById(
    "progressText"
).innerText =
    `Question ${
        currentQuestionIndex + 1
    } of ${
        currentQuiz.questions.length
    }`;

    questionContainer.innerHTML = `
        <h2>${question.question}</h2>

      ${question.options.map(option => `
    <label class="option-card">

        <input
            type="radio"
            name="answer"
            value="${option}"
        >

        <span>${option}</span>

    </label>
`).join("")}

        <br>

        <button onclick="nextQuestion()">
            ${currentQuestionIndex === currentQuiz.questions.length - 1
                ? "Submit Quiz"
                : "Next"}
        </button>
    `;
    document.querySelectorAll(
        '.option-card input'
    ).forEach(input => {

        input.addEventListener(
            'change',
            function() {

                document
                .querySelectorAll(
                    '.option-card'
                )
                .forEach(card => {

                    card.classList.remove(
                        'selected'
                    );

                });

                this.closest(
                    '.option-card'
                ).classList.add(
                    'selected'
                );

            }
        );

    });
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

    document.getElementById(
        "progressWrapper"
    ).style.display = "none";

    document.getElementById(
        "progressText"
    ).style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    const percentage =
        Math.round(
            (score / currentQuiz.questions.length) * 100
        );

    let performanceMessage = "";

    if (percentage === 100) {
        performanceMessage =
            "🏆 Perfect Score!";
    }

    else if (percentage >= 80) {
        performanceMessage =
            "🎉 Excellent Work!";
    }

    else if (percentage >= 60) {
        performanceMessage =
            "📚 Good Job!";
    }

    else if (percentage >= 40) {
        performanceMessage =
            "👍 Nice Try!";
    }

    else {
        performanceMessage =
            "💪 Keep Practicing!";
    }

    document.getElementById(
        "questionContainer"
    ).innerHTML = `

        <div class="result-container">

            <div class="progress-circle">

                <svg width="170" height="170">

                    <circle
                        cx="85"
                        cy="85"
                        r="65"
                        class="bg-circle"
                    ></circle>

                    <circle
                        cx="85"
                        cy="85"
                        r="65"
                        class="progress-ring"
                        style="
                        stroke-dashoffset:
                        ${
                            565 -
                            (565 * percentage / 100)
                        }px"
                    ></circle>

                </svg>

                <div class="percentage">
                    ${percentage}%
                </div>

            </div>

            <h2>${performanceMessage}</h2>

            <h3>
                Score:
                ${score}
                /
                ${currentQuiz.questions.length}
            </h3>

            <div class="result-buttons">

                <button onclick="location.reload()">
                    Retake Quiz
                </button>

                <button onclick="
                    window.location.href='takeQuiz.html'
                ">
                    Back To Quizzes
                </button>

                <button onclick="showReview()">
                    Review Answers
                </button>

            </div>

        </div>

    `;
}

function showReview() {

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
    ).innerHTML = reviewHTML;
}

loadQuiz();