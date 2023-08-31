var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');
const fs = require('fs');


// var indexRouter = require('./routes/index');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);


//routes
const baseURL = 'http://my-service:3001/';


const axiosInstance = axios.create({
  baseURL,
});

// Storage Path
const persistenentStoragePath = "../../darshil_pv_dir/";

app.get('/', function (req, res, next) {

  axiosInstance.get(baseURL)
    .then(response => {
      console.log("working on it")
      res.send("Hola");
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.log("not working dont know");
      res.status(500).send('Error occurred while sending the request');
    });

  console.log("get working");
  // res.send("<h1>Hello, Welcome to Express !</h1>");
});

app.post('/store-file', function (req, res, next) {

  const fileName = req.body.file;
  const fileData = req.body.data;

  if (!fileName) {
    res.send({
      file: fileName,
      error: "Invalid JSON input."
    });
    return;
  }

  fs.writeFile(persistenentStoragePath + fileName, fileData, 'utf8', (err) => {
    if (err) {
      console.error('Error creating file:', err);
      res.send({
        file: fileName,
        error: "Error while storing the file to the storage."
      });
    } else {
      console.log('File created successfully.');
      console.log("File Stored in Persistenent Volume.");
      res.send({
        file: fileName,
        message: "Success."
      })
    }
  });
});


app.post('/calculate', function (req, res, next) {

  console.log("calculating...");

  const jsonData = req.body
  // console.log(jsonData.file)

  if (jsonData != null) {

    const file = jsonData.file;
    const product = jsonData.product;

    if (file == null || product == null) {
      res.send({
        file: file, error: "Invalid JSON input."
      });
    } else {

      axiosInstance.post(baseURL + "mountFile", jsonData, { timeout: 5000 })
        .then(response => {
          // console.log(response)
          res.send(response.data)
        })
        .catch(err => {
          console.log(err)
          res.json(err);
        });

    }

  }
  else {
    res.send({ file: file, error: "Invalid JSON input." });
  }

});



app.listen(6000, function (req, res) {
  console.log(`http://localhost:6000`);
});

