const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
var multer = require('multer')

const assert = require('assert');
const mongodb = require('mongodb');
const formidable = require('formidable')
// DB Config
const db = "mongodb+srv://x@db-cv-wjota.mongodb.net/test?retryWrites=true&w=majority";
const fs = require('fs');

var app = express();
app.use(express.static(__dirname));
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var cors = require('cors');
app.use(cors())

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
    console.log(file.originalname);
  }
})

var upload = multer({storage: storage});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://x@db-cv-wjota.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true});

app.post('/uploadDB', upload.single('file'), (req, res) => {
  var filePath = './' + req.file.originalname;
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    const db = client.db("test");
    var bucket = new mongodb.GridFSBucket(db);
    fs.createReadStream(filePath).pipe(bucket.openUploadStream(req.file.originalname)).on('error', function(error) {
      console.log(error);
    }).on('finish', function() {
      console.log('done save the file!');
    });
  });
  return res.status(200).send(req.file)
});

app.post('/upload', function(req, res) {
  console.log("server accc");
  return res.status(200)
});

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true}). // Adding new mongo url parser
then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

// Serve static assets if in production
app.listen(8000, function() {
  console.log('App running on port 8000');
});
