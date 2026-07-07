let questions = [];
let editQuizId = null;
let editingQuestionIndex = null;

function addQuestion() {

    const question =
        document.getElementById(
            "question"
        ).value;

    const option1 =
        document.getElementById(
            "option1"
        ).value;

    const option2 =
        document.getElementById(
            "option2"
        ).value;

    const option3 =
        document.getElementById(
            "option3"
        ).value;

    const option4 =
        document.getElementById(
            "option4"
        ).value;

    const correctAnswer =
        document.getElementById(
            "correctAnswer"
        ).value;

    const questionData = {

        question,

        options: [
            option1,
            option2,
            option3,
            option4
        ],

        correctAnswer
    };

    console.log(
    "editingQuestionIndex:",
    editingQuestionIndex
);

console.log(
    "Before update:",
    questions
);

    if (
        editingQuestionIndex !== null
    ) {

        questions[
            editingQuestionIndex
        ] = questionData;

        editingQuestionIndex =
            null;

        alert(
            "Question Updated!"
        );

        document.getElementById(
    "editingStatus"
).innerText = "";

document.querySelector(
    'button[onclick="addQuestion()"]'
).innerText =
    "Add Question";

    } else {

        questions.push(
            questionData
        );
    }
    console.log(
    "After update:",
    questions
);
document.querySelector(
    'button[onclick="addQuestion()"]'
).innerText = "Add Question";

    document.getElementById(
        "questionCount"
    ).innerText =
        `Questions Added:
        ${questions.length}`;

    displayQuestionsForEditing();

    document.getElementById(
        "question"
    ).value = "";

    document.getElementById(
        "option1"
    ).value = "";

    document.getElementById(
        "option2"
    ).value = "";

    document.getElementById(
        "option3"
    ).value = "";

    document.getElementById(
        "option4"
    ).value = "";

    document.getElementById(
        "correctAnswer"
    ).value = "";
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

    console.log("Sending to DB:");
console.log(questions);

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

    const result = await response.text();

console.log(result);

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
displayQuestionsForEditing();

window.scrollTo({
    top: 0,
    behavior: "smooth"
}); 
}

function displayQuestionsForEditing() {

    const editor =
        document.getElementById(
            "questionEditor"
        );

    editor.innerHTML = "";

    questions.forEach(
        (question, index) => {

        editor.innerHTML += `

            <div class="review-card">

                <h3>
                    Question ${index + 1}
                </h3>

                <p>
                    ${question.question}
                </p>

                <p>
                    Correct:
                    ${question.correctAnswer}
                </p>

                <button onclick="loadQuestionForEdit(${index})">
    Edit
</button>

                <button onclick="deleteQuestion(${index})">
    Delete
</button>

            </div>

        `;
    });
}

function loadQuestionForEdit(index) {
    console.log("Edit clicked", index);
    editingQuestionIndex = index;

     document.getElementById(
        "editingStatus"
    ).innerText =
        `✏️ Editing Question ${index + 1}`;


     document.querySelector(
        'button[onclick="addQuestion()"]'
    ).innerText =
        "Save Changes";

    const q =
        questions[index];

    document.getElementById(
        "question"
    ).value =
        q.question;

    document.getElementById(
        "option1"
    ).value =
        q.options[0];

    document.getElementById(
        "option2"
    ).value =
        q.options[1];

    document.getElementById(
        "option3"
    ).value =
        q.options[2];

    document.getElementById(
        "option4"
    ).value =
        q.options[3];

    document.getElementById(
        "correctAnswer"
    ).value =
        q.correctAnswer;
}

function deleteQuestion(index){

    questions.splice(
        index,
        1
    );

    displayQuestionsForEditing();

    document.getElementById(
        "questionCount"
    ).innerText =
        `Questions Added:
        ${questions.length}`;
}