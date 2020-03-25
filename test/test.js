const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');

chai.use(chaiHttp);
chai.should();

const baseUrl = chai.request('http://localhost:3000/api');

describe('Users', function() {
  describe('POST SIGNUP', function() {
    it('should signup new user', async function() {
      // setup test user details
      const testUser = {
        username: 'test',
        email: 'test@gmail.com',
        password: '123abc',
        location: 'test',
        bio: 'test'
      };
      const res = await baseUrl.post('/user/signup').send(testUser);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.a.property('_id');
      res.body.should.have.a.property('username');
      res.body.should.have.a.property('dogs');
      res.body.should.have.a.property('email');
    }).timeout(5000);
  });
  describe('POST LOGIN', function() {
    it('should login user and receive a token', async function() {
      // setup test user details
      const testUser = {
        email: 'test@gmail.com',
        password: '123abc'
      };
      const res = await baseUrl.post('/user/login').send(testUser);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
    });
  });
});

describe('Dogs', function() {
  describe('POST DOGS', function() {
    it('should post new dog', async function() {
      token = await getJwt();
      const testDog = {
        breed: 'Test',
        gender: 'Test',
        name: 'Test',
        image: 'Test',
        age: 5,
        price: 100,
        description: 'Test'
      };
      const res = await baseUrl
        .post('/dogs')
        .set('authorization', `Bearer ${token}`)
        .send(testDog);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('dog');
      res.body.dog.should.be.a('object');
      res.body.dog.should.have.property('_id');
      res.body.dog.should.have.property('owner');
    });
  });
  describe('GET DOGS', function() {
    it('should get all dogs', async function() {
      const res = await baseUrl.get('/dogs');
      res.should.have.status(200);
      res.body.should.be.array;
      if (res.body.length !== 0) {
        res.body[0].should.be.a(object);
        res.body[0].should.have.a.property('_id');
        res.body[0].should.have.a.property('username');
        res.body[0].should.have.a.property('dogs');
        res.body[0].should.have.a.property('email');
      }
    });
  });
  // describe('GET DOG', function() {
  //   it('should get one dog and associated date', async function() {
  //     const res = await baseUrl.get()
  //   })
  // })
});

const getJwt = async function() {
  const result = await axios.post('http://localhost:3000/api/user/login', {
    email: 'test@gmail.com',
    password: '123abc'
  });
  return result.data.token;
};
