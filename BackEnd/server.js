const express = require('express');
var app = express();
var fs = require('fs');

app.get('/api/first_questions',(req,res)=>{
	fs.readFile("questions.json","utf8",function(err,data){
		if(err) throw err;
		res.json(data);
		return res.end();
	});
});

app.get('/api/get_question',()=>{

});