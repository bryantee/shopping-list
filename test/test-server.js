global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const Item = require('../models/item');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function () {
  before(function (done) {
    server.runServer(function () {
      Item.create({
          name: 'Broad beans'
        }, {
          name: 'Tomatoes'
        }, {
          name: 'Peppers'
        },
        function () {
          done();
        });
    });
  });

  after(function (done) {
    Item.remove(function () {
      done();
    });
  });
  it('should list items on GET', function(done) {
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length(3);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('name');
        res.body[0]._id.should.be.a('string');
        res.body[0].name.should.be.a('string');
        res.body
        done();
      });
  });
  it('should add an item on post', function(done) {
    chai.request(app)
      .post('/items')
      .send({'name': 'Kale'})
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name', 'Kale');
        res.body.should.have.property('_id');
        res.body._id.should.be.a('string');
        res.body.name.should.be.a('string');
        chai.request(app)
          .get('/items')
          .end(function(err, res) {
            res.body.should.be.a('array');
            res.body.length.should.equal(4);
            res.body[3].name.should.equal('Kale');
            res.body[3]._id.should.be.a('string');
            done();
          });
      });
  });
  it('should edit an item on put', function(done) {
    chai.request(app)
      .get('/items')
      .end(function(err, res) {
        let id = res.body[0]._id;
        chai.request(app)
          .put('/items/' + id)
          .send({'name': 'Brownies', '_id': id})
          .end(function(err, res) {
            res.should.have.status(200);
            chai.request(app)
              .get('/items')
              .end(function(err, res) {
                res.body[0].should.have.property('name', 'Brownies');
                res.body[0].should.have.property('_id', id);
                done();
              });
          });
      });
  });
  it('should delete an item on delete', function (done) {
    chai.request(app)
      .get('/items')
      .end(function (err, res) {
        const id = res.body[3]._id;
        res.body[3].name.should.equal('Kale');
        chai.request(app)
          .delete('/items/' + id)
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('name', 'Kale');
            res.body.should.have.property('_id', id);
            done();
          });
      });
  });
  // it('should get "already exists" when id already exists on POST', function(done) {
  //   chai.request(app)
  //     .post('/items')
  //     .send({'name': 'Carrots'})
  //     .end(function(err, res) {
  //       res.should.have.status(409);
  //       res.should.not.have.status(401);
  //       done();
  //     });
  // });
  it('should get 400 when no data on post', function(done) {
    chai.request(app)
      .post('/items')
      .send({})
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });
  it('should get 400 when not valid json data on post', function(done) {
    chai.request(app)
      .post('/items')
      .send('blah blah blah')
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });
  it('should get 404 when different id in endpoint than body on put', function(done) {
    chai.request(app)
      .get('/items')
        .end(function(err, res) {
          const id = res.body[2]._id;
          chai.request(app)
            .put('/items/' + id)
            .send({'name': 'Hand Sanitizer', 'id': id})
            .end(function(err, res) {
              res.should.have.status(400);
              done();
          });
        });
  });
  // it('should get 400 when no body data on put', function(done) {
  //   chai.request(app)
  //     .put('/items/3')
  //     .send({})
  //     .end(function(err, res) {
  //       res.should.have.status(400);
  //       storage.items.length.should.equal(4);
  //       storage.items[2].name.should.equal('Bananas')
  //       done();
  //     });
  // });
  // it('should get 404 when id doesn\'t exist on delete', function(done) {
  //   chai.request(app)
  //     .delete('/items/26')
  //     .end(function(err, res) {
  //       res.should.have.status(404);
  //       done();
  //     });
  // });
  // it('should get 400 when no id in endoint on delete', function(done) {
  //   chai.request(app)
  //     .delete('/items/')
  //     .end(function(err, res) {
  //       res.should.have.status(404);
  //       storage.items.length.should.equal(4);
  //       done();
  //     });
  // });
  // it('should return items for user', function(done) {
  //   chai.request(app)
  //     .get('/user/bryan')
  //     .end(function(err, res) {
  //       res.should.have.status(200);
  //       res.body.should.be.a('array');
  //       done();
  //     });
  // });
  // it('should return 404 on user not found', function(done) {
  //   chai.request(app)
  //     .get('/user/Mario')
  //     .end(function(err, res) {
  //       res.should.have.status(404);
  //       res.body.should.be.empty;
  //       done();
  //     });
  // });
  // it('should return 404 when id doesn\'t exist on PUT', function(done) {
  //   chai.request(app)
  //     .put('/items/29')
  //     .send({'name': 'Berries', 'id': 29, 'owner': 'Bryan'})
  //     .end(function(err, res) {
  //       res.should.have.status(404);
  //       storage.items.length.should.equal(4);
  //       done();
  //     });
  // });
  // it('should return 400 when no name supplied on PUT', function(done) {
  //   chai.request(app)
  //     .put('/items/3')
  //     .send({'id': 3, 'owner': 'Bryan'})
  //     .end(function(err, res) {
  //       res.should.have.status(400);
  //       storage.items.length.should.equal(4);
  //       done();
  //     });
  // });
  // it('should return 400 when invalid id supplied on delete in parameter', function(done) {
  //   chai.request(app)
  //     .delete('/items/LLKoolJ')
  //     .send({'name': 'Gangster\'s Paradise', 'id': 4, 'owner': 'Thomas'})
  //     .end(function(err, res) {
  //       res.should.have.status(400);
  //       storage.items[3].name.should.be.equal('Kale');
  //       storage.items.length.should.be.equal(4);
  //       done();
  //     });
  // });
});
