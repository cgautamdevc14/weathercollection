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
	  ta1: t[0],
	  tg1: t[1]
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


