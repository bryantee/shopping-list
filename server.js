const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// config for database url and port parameters
const config = require('./config');

const app = express();

app.use((bodyParser.json()));
app.use(express.static('public'));

// model / schema for shopping list item
const Item = require('./models/item');

// GET endpoint consumed by jquery during initial page load
// and each create / read / update / delete
// Returns all shoppping list items in db on call
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

// POST endpoint for creating a specific item
// Takes JSON object with "name" property
// MongoDB handles id creation
app.post('/items', function(req, res) {
  Item.create({
    name: req.body.name
  }, function(err, item) {
    if (err) {
      if (err.errors.name.message == "Path `name` is required.") return res.sendStatus(400);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    res.status(201).json(item);
  });
});

// PUT endpoint for updating item
// Takes valid id in url param and JSON object with new name as "name" property
app.put('/items/:id', function(req, res) {
  let id = req.params.id;
  let newName = req.body.name;

  if (id != req.body._id) return res.sendStatus(400); // id in req object doesn't match url params id

  let query = {
    _id: id
  };

  let update = {
    $set: {
      name: newName
    }
  }

  Item.findOneAndUpdate(query, update, function(err, result) {
    if (!result) {
      return res.status(404).send('Bad id: ' + id);
    } else if (err) {
      return res.status(500).send('Error: ' + err);
    }
    res.sendStatus(200);
  });
});


// DELETE endpoint to delete item in db
// Takes valid item id
// returns JSON of item deleted
app.delete('/items/:id', function(req, res) {
  let id = req.params.id;

  let query = {
    _id: id
  };

  Item.findOneAndRemove(query, function(err, result) {
    if (!result) {
      return res.status(404).send('Bad id: ' + id);
    } else if (err) {
      return res.status(500).send('Error: ' + err);
    } else {
      res.status(200).json(result);
    }
  });
});

// Route for any invalid endpoint attempts
app.use('*', function(req, res) {
  res.status(404).json({
    message: 'Not found'
  });
});

// Start up the server, uses params from config file
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

// runSerber can either be run from the commandline
// OR as a module
if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
}

exports.app = app;
exports.runServer = runServer;
