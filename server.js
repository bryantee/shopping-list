var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
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

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
  response.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
  if (!('name' in req.body)) {
    return res.sendStatus(400);
  }
  var itemName = req.body.name;
  var item = storage.add(itemName);
  res.status(201).json(item);
  console.log("Received " + itemName);
});

app.delete('/items/:id', function(req, res) {
  var id = parseInt(req.params.id);
  var idFound = false;
  if (isNaN(id)) {
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

app.put('/items/:id', jsonParser, function(req, res) {
  var id = parseInt(req.params.id);
  var body = req.body;
  var itemName; // the new name
  var idFound = false;
  if (id != req.body.id) {
    return res.sendStatus(400);
  }
  if (req.body.hasOwnProperty("name")) {
    itemName = req.body.name;
    storage.items.forEach(function(item, index) {
      if (item.id === id) {
        storage.items[index].name = itemName;
        idFound = true;
        res.status(200).json(storage.items[index]);
      }
    });
    if (!idFound) {
      res.sendStatus(400);
    }
  }
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});
