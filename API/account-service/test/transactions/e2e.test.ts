import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

const transactionBody = {
  userEmail: `test.user@google.com`,
  type: 'send',
  amount: 10,
  createdAt: new Date()
};

describe('transactions endpoints', function () {
  let request: supertest.SuperAgentTest;

  before(function () {
    request = supertest.agent(app);
  });

  after(function (done) {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it('should lock simultaneous posts to /transactions', async function () {

    const data = { userEmail: 'tst@test.com', amount: 5, type: "send", createdAt: new Date() };

    // parallel should lock
    const results = await Promise.all([
      request.post('/transactions').send(data), 
      request.post('/transactions').send(data)
    ])

    expect(results.find(result => result.status === 503)).to.not.be.null

    // synchronous should succeed
    const result1 = await request.post('/transactions').send(data)
    const result2 = await request.post('/transactions').send(data)
    
    expect(result1.status).to.equal(201);
    expect(result2.status).to.equal(201);
  });


});
