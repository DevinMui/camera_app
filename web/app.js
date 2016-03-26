var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var spawn = require("child_process").spawn;
var upload = multer({ dest: 'uploads/' })
var app = express()
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var file = ""

var url = 'mongodb://localhost:27017/cam';

function insert(json){
	MongoClient.connect(url, function(err, db) {
  	db.collection('uploads').insertOne(json)
  	db.close();
	});
}
function find(file){
	MongoClient.connect(url, function(err, db){
		db.collection('users').where('pictures').in(file) // dont know if this will work
	})
}
app.post('/upload', upload.single('picture'), function(req, res){
	console.log(req.file)
	var process = spawn('python',["../eigen/eigen.py", "uploads/" + req.file ]);
	setTimeout(function(){
		res.send(find(file)) // should work??
	}, 1000)
})