let questions = [];

function addQuestion() {

    const question = document.getElementById("question").value;

    const option1 = document.getElementById("option1").value;
    const option2 = document.getElementById("option2").value;
    const option3 = document.getElementById("option3").value;
    const option4 = document.getElementById("option4").value;

    const correctAnswer =
        document.getElementById("correctAnswer").value;

    questions.push({
        question,
        options: [
            option1,
            option2,
            option3,
            option4
        ],
        correctAnswer
    });

    document.getElementById("questionCount").innerText =
        `Questions Added: ${questions.length}`;

    document.getElementById("question").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
    document.getElementById("correctAnswer").value = "";
}

async function saveQuiz() {

    const title =
        document.getElementById("quizTitle").value;

    const response = await fetch(
        "/api/quizzes",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                questions
            })
        }
    );

    const data = await response.json();

    alert("Quiz Saved Successfully!");

    console.log(data);
}