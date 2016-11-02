const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();

app.use((bodyParser.json()));
app.use(express.static('public'));

const Item = require('./models/item');

app.get('/items', function(req, res) {
  Item.find(function(err, items) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(200).json(items);
  });
});

app.post('/items', function(req, res) {
  Item.create({
    name: req.body.name
  }, function(err, item) {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(201).json(item);
  });
});

app.use('*', function(req, res) {
  res.status(404).json({
    message: 'Not found'
  });
});

const runServer = function(callback) {
  mongoose.connect(config.DATABASE_URL, function(err) {
    if (err && callback) {
      return callback(err);
    }
    app.listen(config.PORT, function() {
      console.log('Listening on localhost:' + config.PORT);
      if (callback) {
        callback();
      }
    });
  });
};

if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
}

exports.app = app;
exports.runServer = runServer;
