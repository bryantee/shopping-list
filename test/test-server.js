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
  it('should edit an item on put');
  it('should delete an item on delete');
  it('should send message "ID exists" on post');
  it('should send message "no data" on post');
  it('should send message "not valid json data" on post');
  it('should send message "not valid id" on put');
  it('should send message "different id in endpoint than body" on put');
  it('should send message "no body data" on put');
  it('should send message "data not in json form" on put');
  it('should send message "id doesn\'t exist" on delete');
  it('should send message "no id in endoint" on delete');
});
