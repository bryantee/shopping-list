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

app.delete('/items/:id', jsonParser, function(req, res) {
  var id = req.params.id;
  console.log('Receied request to delete item with id of ' + id);
  storage.items.forEach(function(item) {
    console.log('forEach called on storage.items...');
    console.log('item id is: ' + item.id + ' and name is: ' + item.name);
    if (item.id == id) {  // <-- Is this a good way to deal with type coercion?
      console.log('Found item with matching id ' + id);
      storage.items.splice(item, 1);
      res.status(200).json(item);
    }
  });
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});
