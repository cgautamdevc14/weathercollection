var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var MS = require("mongoskin")
var port = 8080;
var VALUE = 10;

var db = MS.db("mongodb://127.0.0.1:27017/test")


app.get("/getAverage", function (req, res) {
  var from = parseInt(req.query.from);
  var to = parseInt(req.query.to);
  db.collection("data").find({time:{$gt:from, $lt:to}}).toArray(function(err, result){
  	console.log(err);
  	console.log(result);
  	var tempSum = 0;
  	var humSum = 0;
  	for(var i=0; i< result.length; i++){
  		tempSum += result[i].t || 0;
  		humSum += result[i].t || 0;
  	}
  	var tAvg = tempSum/result.length;
  	var hAvg = humSum/result.length;
  	res.send(tAvg + " "+  hAvg);
  });
});

app.get("/getLatest", function (req, res) {
  db.collection("data").find({}).sort({time:-1}).limit(10).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});

app.get("/getData", function (req, res) {
  var from = parseInt(req.query.from);
  var to = parseInt(req.query.to);
  db.collection("data").find({time:{$gt:from, $lt:to}}).sort({time:-1}).toArray(function(err, result){
    res.send(JSON.stringify(result));
  });
});


app.get("/getValue", function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send(VALUEt.toString() + " " + VALUEh + " " + VALUEtime + "\r");
});


app.get("/", function (req, res) {
    res.redirect("/index.html");
});

app.get("/getValue", function (req, res) {
  db.collection("data").find({}).toArray(function(e,v){
    res.send(JSON.stringify(v));
  });
});

app.get("/setValue", function (req, res) {
  var t = decodeURIComponent(req.query.v).split(",");
	console.log(t);
	var v = {
	  id: t[0],
	  ta1: t[1],
	  tg1: t[2]
	}
  v.time = new Date().getTime();
  db.collection("data").insert(v, function(e,r){
    res.send(v.toString());
  });
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);


