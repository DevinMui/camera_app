var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var mongoose = require('mongoose');
var spawn = require("child_process").spawn;
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
var app = express()
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
mongoose.connect('mongodb://localhost/test');
var conn = mongoose.connection
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pictures/')
  },
  filename: function (req, file, cb) {

      cb(null,  number() + ".jpg" );

  }
});
var store = multer({ storage: storage });
var file = ""

var userSchema = new mongoose.Schema({
  name: String
, fb: String
, tw: String
, pictures: [String]
});

var User = mongoose.model('User', userSchema)

function number(){
	var number = 0
	fs.readdir("./pictures", function(err, items) {
    for (var i=0; i<items.length; i++) {
      number += 1
    }
	});
	return number
}

app.post('/upload', upload.single('picture'), function(req, res){
	console.log(req.file)
	var process = spawn('python',["../eigen/eigen.py", "uploads/" + req.file ]);
	setTimeout(function(){
	var file = ""
	fs.readFile('file.txt', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  console.log(data);
	  file = data
	});
		user = User.find({ "pictures": file })
		res.send(user)
	}, 1000) // wait a second
})

app.post('/add_picture', store.single('picture'), function(req, res){
	User.update({ _id: req.body.id }, {$push: {"pictures": req.body.path }}, {safe: true, upsert: true}, function(err, user) {
	  console.dir(user);
	})
	res.send("uploaded! training...")
})

app.post('/new', function(req, res){
	var user = new User ({
		name: req.body.name,
		fb: req.body.fb,
		tw: req.body.tw,
		pictures: []
	})
	user.save(function(err, user){
		console.dir(user)
	})
	console.log(user)
	res.send(user)
})

app.get('/test', function(req, res){
	var user = new User ({
		name: "Orange",
		fb: "Orange",
		tw: "Orange",
		pictures: []
	})
	user.save(function(err, user){
		console.dir(user)
	})
	console.log(user)
	res.send(user)
})

app.listen(3000, function () {
  console.log('running on port 3000');
});