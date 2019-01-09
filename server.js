var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var mysql = require("mysql");

var upload = multer({ dest: "uploads/" });

var cpUpload = upload.fields([{ name: "files" }]);

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "20190108"
});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./www"));

app.use("/api", cpUpload, (req, res) => {
  //console.log(req)
  //console.log(req.body, req.files);
  let fileArray=[];
  req.files.files.forEach(file => {
    fileArray.push(`('${file.originalname}','${file.filename}','${Math.floor(new Date() / 1000)}')`);
  });
  query = `INSERT INTO upload_table (originalname,filename,dateTime) VALUES${fileArray.join(",")}`;
  pool.query(query,(err,result)=>{
    if(err) throw err;
    console.log(result)
    res.send("OK");
  })
});

app.listen("8888");
