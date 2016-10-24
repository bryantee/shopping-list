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

app.listen(3000, function() {
  console.log('listening on port 3000');
});
