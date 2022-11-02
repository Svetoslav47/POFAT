const express = require('express');
const session = require('express-session');
const storige = require("session-file-store")(session);
const app = express();
const port = 3000;
var fs = require('fs');
var qs = require('querystring');



app.use(session({
    name: "Idiot_niki",
    secret: 'wakdjvwejhfgbhwbeskjfbk',
    saveUninitialized: true,
    resave: false,
    store: new storige()
}))


app.get('/', (req, res) => {
    //main page
});

app.get('/test', (req, res) => {
    req.session.id = "test"

    res.writeHead(301,{Location: 'http://localhost:3000/test/questions'});
    res.end();
  
});

app.get('/test/questions', (req, res) => {
    let questions = JSON.parse(fs.readFileSync("./questions.json"))
    let arr = [0,0,0,0,0,0,0,0,0,0,0,0]
    req.session.subjects = JSON.stringify(arr)
    req.session.question = questions
    req.session.questions = fs.readFileSync("./questions.json")
    
    res.send("test"+req.session.question.length);
})


app.post('/test/questions', (req, res) => {
    let body=''
    req.on('data',(dat) => {
        body+=dat
      
    }).on('end',() => {
        let otg = JSON.parse(body)
        let subjects = JSON.parse(req.session.subjects)

        for(let i=0; i<otg.length; i++){
            for(let j=0; j<req.session.question[i].options[otg[i]].fields.length; j++){
                subjects[req.session.question[i].options[otg[i]].fields[j]] += req.session.question[i].options[otg[i]].scores[j]
            }
        }
        req.session.subjects = JSON.stringify(subjects)
        return res.end()
    })
});

app.get('/test/question', (req,res) => {
    let questions = JSON.parse(req.session.questions)
    let subjects = JSON.parse(req.session.subjects)

    let max = 0;
    let max_i = 0;
    for(let i=0; i<subjects.length; i++){
        if(subjects[i]>max){
            max = subjects[i]
            max_i = i
        }
    }
    for(let j=0; j<questions.length; j++){
        if(questions[j].main_field == max_i){
            req.session.question = JSON.parse(JSON.stringify(questions[j]))
            res.send(JSON.stringify(questions[j]))
            questions[j].main_field = -1
            req.session.questions = JSON.stringify(questions)
            break
        }
    }
});



app.listen(port, () => {});