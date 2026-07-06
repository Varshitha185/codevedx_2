let questions = [];
let editQuizId = null;

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
        document.getElementById(
            "quizTitle"
        ).value;

    let url =
        "/api/quizzes";

    let method =
        "POST";

    if(editQuizId){

        url =
            `/api/quizzes/${editQuizId}`;

        method =
            "PUT";
    }

    const response =
        await fetch(
            url,
            {
                method,

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    title,
                    questions
                })
            }
        );

    await response.json();

    alert(
        editQuizId
        ? "Quiz Updated!"
        : "Quiz Saved!"
    );

    editQuizId = null;

    questions = [];

    document.getElementById(
        "quizTitle"
    ).value = "";

    document.getElementById(
        "questionCount"
    ).innerText =
        "Questions Added: 0";

    document.querySelector(
        'button[onclick="saveQuiz()"]'
    ).innerText =
        "Save Quiz";

    loadCreatedQuizzes();
}

async function loadCreatedQuizzes() {

    const response =
        await fetch("/api/quizzes");

    const quizzes =
        await response.json();

    const container =
        document.getElementById(
            "createdQuizzes"
        );

    if (!container) return;

    container.innerHTML = "";

    quizzes.forEach(quiz => {

        container.innerHTML += `

    <div class="quiz-card">

        <h3>${quiz.title}</h3>

        <p>
            ${quiz.questions.length}
            Questions
        </p>

        <button
    onclick="editQuiz('${quiz._id}')"
>
    Update
</button>

<button
    class="delete-btn"
    onclick="deleteCreatedQuiz('${quiz._id}')"
>
    Delete
</button>

    </div>

`;
    });
}
loadCreatedQuizzes();

async function deleteCreatedQuiz(id){

    const confirmDelete =
        confirm("Delete this quiz?");

    if(!confirmDelete){
        return;
    }

    await fetch(
        `/api/quizzes/${id}`,
        {
            method:"DELETE"
        }
    );

    loadCreatedQuizzes();
}

async function editQuiz(id){

    const response =
        await fetch(`/api/quizzes`);

    const quizzes =
        await response.json();

    const quiz =
        quizzes.find(q => q._id === id);

    editQuizId = id;

    document.getElementById(
        "quizTitle"
    ).value = quiz.title;

    questions = quiz.questions;

    document.getElementById(
        "questionCount"
    ).innerText =
        `Questions Added: ${questions.length}`;

    document.querySelector(
        'button[onclick="saveQuiz()"]'
    ).innerText =
        "Update Quiz";

        window.scrollTo({
    top: 0,
    behavior: "smooth"
});

alert(
    "Quiz loaded. Edit the title, add/remove questions, then click Update Quiz."
);

}