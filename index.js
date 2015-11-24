"use strict";

var express = require("express");

var app = express();
app.use(express.static("./src/views"));

app.get("/", function(req, res){
	res.render("index.html");
});

app.listen(3001, function(){
  	console.log("server running on port 3001");
});