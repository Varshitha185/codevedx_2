async function loadQuizzes() {

    const response =
        await fetch("/api/quizzes");

    const quizzes =
        await response.json();

    const quizList =
        document.getElementById("quizList");

    quizList.innerHTML = "";

    quizzes.forEach((quiz) => {

        quizList.innerHTML += `
    <div class="quiz-card">
        <h2>${quiz.title}</h2>

        <p>${quiz.questions.length} Questions</p>

        <button onclick="startQuiz('${quiz._id}')">
    Start Quiz
</button>

<button
    onclick="deleteQuiz('${quiz._id}')"
>
    Delete
</button>
    </div>
`;
    });
}

function startQuiz(id) {

    window.location.href =
        `quiz.html?id=${id}`;
}

async function deleteQuiz(id) {

    const confirmDelete =
        confirm("Delete this quiz?");

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(
        `/api/quizzes/${id}`,
        {
            method: "DELETE"
        }
    );

    console.log(await response.json());

    loadQuizzes();
}

loadQuizzes();