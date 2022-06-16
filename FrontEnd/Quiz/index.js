document.querySelector(".startButton").addEventListener("click", startQuiz);

function startQuiz(){
    fetch("/api/first_questions").then((res) => {
        console.log(res);
    });
}