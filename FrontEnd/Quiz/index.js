document.querySelector(".startButton").addEventListener("click", startQuiz);

const numberOfQuestionsToAsk = 20;
let numberOfQuestionsAwnsered = 0;
let numberOfStartingQuestions = 0;
const startingQuestions = [];

function startQuiz() {
    fetch("/api/first_questions").then((res) => {
        res.json().then((responseJson) => {
            console.log(responseJson);
            numberOfStartingQuestions = responseJson.lenght;
            startingQuestions.push(...responseJson);
            askQuestion();
        });
    });
}

function askQuestion(question) {

}

function awnserStartingQuestion() {
    numberOfQuestionsAwnsered++;
    if (numberOfQuestionsAwnsered < numberOfStartingQuestions) {
        askQuestion(startingQuestions[numberOfQuestionsAwnsered]);
    } else if (numberOfQuestionsAwnsered == numberOfStartingQuestions) {
        fetch("/api/first_questions", {
            method: "POST",
            body: JSON.stringify([1, 2, 3, 4, 5, 6]),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            fetch("/api/get_question").then((response) => {
                JSON.parse(response).then((question) => {
                    renderQuestion(question);
                })
            })
        })


    } else if (numberOfQuestionsAwnsered < numberOfQuestionsToAsk) {
        fetch("/api/get_question").then((response) => {
            JSON.parse(response).then((question) => {
                renderQuestion(question);
            })
        })
    } else {
        //show result
    }

}

function renderQuestion(question) {
    switch (question.type) {
        case "chose":
            document.querySelector("")
            break;

        default:
            break;
    }
}