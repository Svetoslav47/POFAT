document.querySelector(".startButton").addEventListener("click", startQuiz);

function startQuiz(){
    fetch("/api/first_questions").then((res) => {
        res.json().then((jsonParse) => {
            let responseJson = jsonParse;
            console.log(responseJson)
        });
    });
}