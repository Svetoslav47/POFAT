const express = require('express');
var app = express();
var fs = require('fs');
var session = require('express-session');
const filestore = require("session-file-store")(session);
var qs = require('querystring');
var router = express.Router();

app.use(express.static(__dirname + '/../FrontEnd'));

//Database later(not file)
	fs.readFile(__dirname + "/all_questions.json","utf8",function(err,data){
		if(err) throw err;
		var all_questions = JSON.parse(data);
		return;
	});

app.use(session({
    name: "Session",
    secret: "aertsysjdhtjfjytr",
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}));


router.get('/',(req,res)=>{
	fs.readFile("../FrontEnd/Quiz/index.html", (err, data) => {
		if(err){
			throw err;
		}else{
			res.writeHead(200, {"Content-Type" : "text/html"})
			res.write(data);
		}
		return res.end();
	})
});

router.get('/api/first_questions',(req,res)=>{
	//Database later(not file)
	req.session.subs = [];
	fs.readFile(__dirname + "/questions.json","utf8",function(err,data){
		if(err) throw err;
		res.write(data);
		req.session.question = data;
		for(let i=0;i<12;i++){
			req.session.subs[i] = 0;
		}
		return res.end();
	});
});

router.post('/api/first_questions',(req,res)=>{
	let body = [];
	req.on('data', (dat)=>{
		body.push(dat);
	}).on('end',()=>{
		body = Buffer.concat(body).toString();
		const otg = JSON.parse(body);
		var qestions = JSON.parse(req.session.question);
		for(let i=0;question[i]!=undefined;i++){
			for(let j=0;question[i].options[otg[i]].fields[j]!=undefined;j++){
				req.session.subs[question[i].options[otg[i]].fields[j]] += question[i].options[otg[i]].scores[j];
			}
		}
	});
	res.end();
});

router.get('/api/get_question',(req,res)=>{
	var subjects = req.session.subs;
	var max = -3000;
	var dir;

	for(let i=0;subjects[i]!=undefined;i++){
		if(max<subjects[i]){
			max = subjects[i];
			dir = i;
		}
	}
	for(let j=0;all_questions[j]!=undefined;j++){
		if(all_questions[j].main_field == dir){
			res.write(all_questions[j]);
			all_questions[j].main_field = -1;
			req.session.question = all_questions[j];
		}
	}
	res.end();
});

router.post('/api/get_question',(req,res)=>{
	let body = [];
	req.on('data', (dat)=>{
		body.push(dat);
	}).on('end',()=>{
		body = Buffer.concat(body).toString();
		const answer = qs.parse(body);
		var qestion = JSON.parse(req.session.question);
		for(let i=0;question.options[answer].fields[i]!=undefined;i++){
			req.session.subs[question.options[answer].fields[i]] += question.options[answer].scores[i];
		}
	});
	res.end();
});

router.get('/api/get_result',(req,res)=>{
	var subjects = req.session.subs;
	var professions;
	var br = 0;
	var numb;
	var maxIndex;

	//Database later(not file)
	fs.readFile(__dirname + "/professions.json","utf8",function(err,data){
		if(err) throw err;
		var prof = JSON.parse(data);
		return;
	});

	for(let i=0;prof[i]!=undefined;i++){
		for(let j=0;prof[i].min[j]!=undefined;j++){
			if(subjects[j]<prof[i].min[j]){
				professions[i - br] = "\0";
				numb[i - br] = 0;
				br++;
				break;
			}
			professions[i - br] = prof[i].prof;
			numb[i - br] += subjects[j] - prof[i].min[j];
		}
	}

	for (let i = 0; i < 5; i++) {
		maxIndex[i] = numb.indexOf(Math.max(...numb));
		numb[maxIndex[i]] = 0;
    }

	var prof_json = "[";
	for (let i = 0; i < 5; i++) {
		prof_json += `"${professions[maxIndex[i]]}",`;
	}
	prof_json.slice(0,-1);
	prof_json += "]";
	res.write(prof_json);
	res.end();
});

app.use("/",router);
app.listen(9988, () => {});