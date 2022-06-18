document.querySelector(".startButton").addEventListener("click", startQuiz);

const numberOfQuestionsToAsk = 20;
let numberOfQuestionsAwnsered = 0;
let numberOfStartingQuestions = 0;
const startingQuestions = [];

const introDivElement = document.querySelector("#intro");
const choseDivElement = document.querySelector("#optionQuestions");
const ratingDivElement = document.querySelector("#sliderQuestion");

function startQuiz() {
    fetch("/api/first_questions").then((res) => {
        res.json().then((responseJson) => {
            console.log(responseJson);
            numberOfStartingQuestions = responseJson.lenght;
            startingQuestions.push(...responseJson);
            introDivElement.classList.add("hidden");
            askQuestion();
        })
    })
}

function askQuestion(question) {

}

function awnserQuestion() {
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

function renderQuestion(){
    const question = questions[numQuestionsAnswered];
    console.log(question)
    switch (question.type) {
        case "chose":
            choseDivElement.classList.remove("hidden");
            const optionsElements = choseDivElement.querySelectorAll(".option");
            question.options.forEach((option, id) => {
                console.log(option);
                optionsElements[id].querySelector(".imageBorder").querySelector(".optionImage").src = `/Pictures/fields/field_${option.main_field}_image.png`;
                optionsElements[id].querySelector(".optionText").innerText = option.text;
            });
            break;

        case "rating":
            choseDivElement.style.display = "block";
            break;

        default:
            break;
    }
}

function showResults() {
    var xValues = [
        ["Label1 Line1:", "Label1 Line2"],
        ["Label2 Line1", "Label2 Line2"], "Spain \n 10%", "USA \n 10%", "Argentina \n 10%"
    ];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["#A299E9", "white", "white", "white", "white"];

    new Chart("profChart", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    }
                }],
                xAxes: [{
                    barPercentage: 0.4
                }]
            }
        }
    });
}