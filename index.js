// simple node.js application to receive data from clients and keep this data in memory

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mongoose = require('mongoose');
const MeasurementsM = require('./measurements.js').MeasurementsM;

var DB_HOST = process.env.DB_HOST || 'localhost';
var DB_PORT = process.env.DB_PORT || 27017;
var DB_NAME = process.env.DB_NAME || 'co2Ampel';
var DB_URI;
if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
  DB_URI = 'mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;
} else {
  DB_URI = 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;
}

mongoose.connect(DB_URI).then(() => {
  console.log(`connected via ${DB_URI} to MongoDB`);
});

// get request received - print the measurement data to console log and return it to requester
app.get('/data',(req, res)=> {
  MeasurementsM.find()
  .then((measurementdata) => {
    console.log(measurementdata);
    res.status(200).send(measurementdata);
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err);
  });
}); 

// post event is received from eventbus - so put the data into mongoDB
app.post('/events',(req, res)=> {
  const {type, measurementdata} = req.body;

  console.log(type); 
  console.log(measurementdata);
  
  const measurementsM = new MeasurementsM(measurementdata);

  measurementsM.save(function(err, measurementsM) {
    if (err) {
      console.log(err);
      return res.status(500).send;
    }
  });

  res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
