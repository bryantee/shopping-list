const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();
const app = server.app;
const storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function () {
  it('should list items on GET', function(done) {
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length(4);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('owner');
        res.body[0].id.should.be.a('number');
        res.body[0].name.should.be.a('string');
        res.body
        done();
      });
  });
  it('should add an item on post', function(done) {
    chai.request(app)
      .post('/items')
      .send({'name': 'Kale', 'username': 'Thomas'})
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name', 'Kale');
        res.body.should.have.property('id', 5);
        res.body.should.have.property('owner', 'Thomas');
        res.body.id.should.be.a('number');
        res.body.name.should.be.a('string');
        res.body.owner.should.be.a('string');
        storage.items[4].should.have.property('name', 'Kale');
        storage.items[4].should.have.property('id', 5);
        storage.items[4].should.have.property('owner', 'Thomas');
        storage.items[4].should.be.a('object');
        storage.items[4].id.should.be.a('number');
        storage.items[4].name.should.be.a('string');
        storage.items[4].owner.should.be.a('string');
        storage.items.should.have.length(5);
        done();
      });
  });
  it('should edit an item on put', function(done) {
    chai.request(app)
      .put('/items/4')
      .send({'name': 'Bananas', 'owner': 'Jesse', 'id': 4})
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name', 'Bananas');
        res.body.should.have.property('id', 4);
        res.body.should.have.property('owner', 'Jesse');
        storage.items[3].should.be.a('object');
        storage.items[3].should.have.property('name', 'Bananas');
        storage.items[3].should.have.property('id', 4);
        storage.items[3].should.have.property('owner', 'Jesse');
        done();
      });
  });
  it('should delete an item on delete', function(done) {
    chai.request(app)
      .delete('/items/3')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('name', 'Ghost Pepper Extract');
        res.body.should.have.property('id', 3);
        res.body.should.have.property('owner', 'Jesse');
        storage.items[2].name.should.not.equal('Ghost Pepper Extract');
        storage.items[2].id.should.not.equal(3);
        done();
      });
  });
  it('should get "already exists" when id already exists on POST', function(done) {
    chai.request(app)
      .post('/items')
      .send({'name': 'Carrots', 'id': 2, 'username': 'Bryan'})
      .end(function(err, res) {
        res.should.have.status(409);
        res.should.not.have.status(401);
        storage.items[1].name.should.equal('Tomatoes');
        storage.items[1].name.should.not.equal('Carrots')
        done();
      });
  });
  it('should get 400 when no data on post');
  it('should get 400 when not valid json data on post');
  it('should get 400 when no valid id on put');
  it('should get 404 when different id in endpoint than body on put');
  it('should get 400 when no body data on put');
  it('should get 404 when data not in json form on put');
  it('should get 404 when id doesn\'t exist on delete');
  it('should get 400 when no id in endoint on delete');
});
