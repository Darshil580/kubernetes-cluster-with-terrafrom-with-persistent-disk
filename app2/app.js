var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')



var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Storage Path
const persistenentStoragePath = "../../darshil_pv_dir/";

//routes

app.get('/', function (req, res, next) {
  console.log("Recieved")
  res.send('<h1> Working</h1>');
});


app.post('/mountFile', (req, res, next) => {
  console.log("Recieved")

  const file = req.body.file;
  const product = req.body.product;

  console.log(file, product);

  const productData = mountDataFile(file)

  // console.log(productData)
  if (productData) {

    sum = processData(productData, product)

    console.log("Sum: " + sum)
    if (sum == 0 || sum) {
      res.send({ file: file, sum: "" + sum });
    }
    else {
      res.send({ file: file, error: "Input file not in CSV format." });
    }

  }
  else {
    res.send({ file: file, error: "File not found." });
  }
});

const mountDataFile = (file) => {

  let splitData;

  try {
    const fileData = fs.readFileSync(persistenentStoragePath + file, 'utf8');
    splitData = fileData.split("\n");
    // fs.close();
  } catch (error) {
    console.error('Error reading file:', error);
    return false
  }

  console.log(splitData);
  return splitData;
};


const processData = (data, product) => {

  const columns = data[0].split(",");

  sum = 0;

  console.log("processing", " on ", "product: ", product);
  console.log(data)
  for (let index = 1; index < data.length; index++) {

    rowValues = data[index].split(",");
    if (rowValues.length != 2) {
      return null
    }
    else {
      if (rowValues[0] == product) {
        sum += parseInt(rowValues[1])
      }
      else {
        continue
      }
    }

  }

  // console.log(sum)

  return sum;
}



app.listen(3001, () => {
  console.log(`http://localhost:3001`)
  console.log("running");
})

