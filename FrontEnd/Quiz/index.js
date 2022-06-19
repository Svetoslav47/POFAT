document.querySelector(".startButton").addEventListener("click", startQuiz);

const numberOfQuestionsToAsk = 4;
let numberOfQuestionsAnswered = 0;
let numberOfStartingQuestions = 0;
const startingQuestions = [];

const introDivElement = document.querySelector("#intro");
let choseDivElement = document.querySelector("#optionQuestions");
let ratingDivElement = document.querySelector("#sliderQuestion");

function startQuiz() {
    fetch("/api/first_questions").then((res) => {
        res.json().then((responseJson) => {
            console.log(responseJson);
            numberOfStartingQuestions = responseJson.length;
            startingQuestions.push(...responseJson);
            introDivElement.classList.add("hidden");
            renderQuestion(startingQuestions[0]);
        })
    })
}

function answerQuestion(answer) {
    numberOfQuestionsAnswered++;
    if (numberOfQuestionsAnswered < numberOfStartingQuestions) {
        renderQuestion(startingQuestions[numberOfQuestionsAnswered]);
    } else if (numberOfQuestionsAnswered == numberOfStartingQuestions) {
        fetch("/api/first_questions", {
            method: "POST",
            body: JSON.stringify([1, 2]),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            fetch("/api/get_question").then((response) => {
                response.json().then((question) => {
                    renderQuestion(question);
                })
            })
        })


    } else if (numberOfQuestionsAnswered < numberOfQuestionsToAsk) {
        fetch("/api/get_question", {
            method: "POST",
            body: JSON.stringify(answer),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            fetch("/api/get_question").then((response) => {
                console.log("test <3")
                response.json().then((question) => {
                    renderQuestion(question);
                })
            })
        })
    } else {
        fetch("/api/get_result").then((result) => {
            result.json().then((data) => {
                showResults(data);
            })
        })
    }

}

function renderQuestion(question){
    switch (question.type) {
        case "chose":
            choseDivElement.querySelector(".questionTitle").textContent = question.question;
            choseDivElement.classList.remove("hidden");
            if(!ratingDivElement.classList.contains("hidden")){
                ratingDivElement.classList.add("hidden");
            }
            const optionsElements = choseDivElement.querySelectorAll(".option");
            question.options.forEach((option, id) => {
                const imageBorder = optionsElements[id].querySelector(".imageBorder");
                imageBorder.querySelector(".optionImage").src = `/Pictures/fields/field_${option.main_field}_image.png`;
                optionsElements[id].querySelector(".optionText").innerText = option.text;

                imageBorder.addEventListener("click", () => {
                    let old_element = choseDivElement;
                    let new_element = old_element.cloneNode(true);
                    old_element.parentNode.replaceChild(new_element, old_element);
                    choseDivElement = new_element;
                    answerQuestion(id);
                })
            });
            break;

        case "rating":
            ratingDivElement.querySelector(".questionTitle").textContent = question.question;
            ratingDivElement.classList.remove("hidden");
            if(!choseDivElement.classList.contains("hidden")){
                choseDivElement.classList.add("hidden");
            }
            const slider = ratingDivElement.querySelector(".slider");
            slider.max = question.options_num-1;
            slider.value = (question.options_num-1)/2
            
            ratingDivElement.querySelector(".continue").addEventListener("click",() => {
                let old_element = ratingDivElement;
                let new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                ratingDivElement = new_element;
                answerQuestion(Math.round(slider.value));
            })

            break;

        default:
            break;
    }
}

function showResults(result) {
    console.log(result);

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