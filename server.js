var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

var cpUpload = upload.fields([{name:"files"}]);

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./www"));

app.use("/api", cpUpload, (req, res) => {
  //console.log(req)
  console.log(req.body, req.files);
  
  res.send("OK");
});

app.listen("8888");