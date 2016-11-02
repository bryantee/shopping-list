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

app.put('/items/:id', function(req, res) {
  let id = req.params.id;
  let newName = req.body.name;

  if (id === 'undefined') res.status(400).send('Bad request, invalid ID');
  if (newName === 'undefined' || newName === null) res.status(400).send('Bad request, no name given'); //This isn't working yet

  let query = {
    _id: id
  };

  let update = {
    $set: {
      name: newName
    }
  }

  Item.findOneAndUpdate(query, update, function(err, result) {
    console.log(result.name);
    res.status(200).json({
      message: 'Received ' + newName
    });
  });
});

app.delete('/items/:id', function(req, res) {
  let id = req.params.id;

  let query = {
    _id: id
  };

  Item.findOneAndRemove(query, function(err, result) {
    if (!result || err) {
      console.error('Error:', err);
      return res.status(404).send('Bad Request');
    } else {
      res.status(200).json(result);
    }
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
