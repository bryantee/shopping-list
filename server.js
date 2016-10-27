var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name, username) {
    var item = {name: name, id: this.setId, owner: username};
    this.items.push(item);
    this.setId += 1;
    return item;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

// Sets dummy data in app
storage.add('Broad beans', 'Bryan');
storage.add('Tomatoes', 'Bryan');
storage.add('Ghost Pepper Extract', 'Jesse');
storage.add('Banana Peels', 'Jesse');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
  response.json(storage.items);
});

// Route to create new item
app.post('/items', jsonParser, function(req, res) {
  if ((Object.keys(req.body).length = 0) || req.body.name === undefined) {
    return res.status(400).send('Request is not a valid JSON object.');
  }
  // TODO: Make username required at later date. Would break front end right now.
  var username = req.body.username;
  var itemName = req.body.name;
  var duplicateId = false;
  // check if resource already exists
  // if so, send back status code 409
  storage.items.forEach(function(item, index) {
    if (item.id === req.body.id) {
      duplicateId = true;
    }
  });
  if (!duplicateId) {
    var item = storage.add(itemName, username);
    res.status(201).json(item);
  } else {
    res.status(409).send("Duplicate id found");
  }
});


// Route to delete item based on specified id
app.delete('/items/:id', function(req, res) {
  var id = parseInt(req.params.id);
  var idFound = false;
  if (isNaN(id) || id === undefined) {
    return res.sendStatus(400);
  }
  storage.items.forEach(function(item, index) {
    if (item.id === id) {
      storage.items.splice(index, 1);
      idFound = true;
      res.status(200).json(item);
    }
  });
  if (!idFound) {
    res.sendStatus(404);
  }
});

// Route that updates item name based on specified id
app.put('/items/:id', jsonParser, function(req, res) {
  var id = parseInt(req.params.id);
  var body = req.body;
  var itemName;
  var idFound = false;
  if (id != req.body.id) {
    return res.sendStatus(400);
  }
  if (body.hasOwnProperty("name")) {
    itemName = req.body.name;
    storage.items.forEach(function(item, index) {
      if (item.id === id) {
        storage.items[index].name = itemName;
        idFound = true;
        res.status(200).json(storage.items[index]);
      } else if (!body.hasOwnProperty("name")){
        return res.sendStatus(400).send("No 'name' property found in JSON request.");
      }
    });
    if (!idFound) {
      res.sendStatus(404);
    }
  }
});

// Route that returns json object of items owned by specified user. Currently not wired up to front end.
app.get('/user/:username', function(req, res) {
  var username = req.params.username.toLowerCase();
  var userItems = [];
  var userFound = false;
  // Look for items owned by user, push to userItems
  storage.items.forEach(function(item, index) {
    if (item.owner.toLowerCase() === username) {
      userItems.push(item);
      userFound = true;
    }
  });
  if (!userFound) {
    res.status(404).send("User " + username + " not found.");
  }
  if (userFound) {
    res.json(userItems);
  }
});

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;
