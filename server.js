var proxy = require("http-proxy-middleware");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");
var mysql = require("mysql");
var { getKC } = require("./mock");

var upload = multer({ dest: "uploads/" });

var cpUpload = upload.fields([{ name: "files" }]);

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "20190108"
});

var app = express();

const apiProxy = proxy("/api", {
  target: "http://ys.qrit.cn:20057",
  changeOrigin: true,
  pathRewrite: { "^/api": "/tools" }
});

app.use("/api/*", apiProxy); //api子目录下的都是用代理

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./www"));

app.use("/api/upload", cpUpload, (req, res) => {
  //console.log(req)
  //console.log(req.body, req.files);
  let fileArray = [];
  req.files.files.forEach(file => {
    fileArray.push(
      `('${file.originalname}','${file.filename}','${Math.floor(
        new Date() / 1000
      )}')`
    );
  });
  query = `INSERT INTO upload_table (originalname,filename,dateTime) VALUES${fileArray.join(
    ","
  )}`;
  pool.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("OK");
  });
});

app.use("/api/getKC", (req, res) => {
  let kcList = getKC().array;
  res.send(kcList);
});

app.listen("8888");
