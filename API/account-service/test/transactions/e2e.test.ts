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

const userEmailUnChanged = "Rod.Wintheiser86@gmail.com"
const lockedUser = "Annabell.Wintheiser@hotmail.com"
const unlockedUser = "Coby_Corwin2@gmail.com"
const simulUser = "Jodie0@hotmail.com"

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

  it('should return balance of an account GET /accounts/:userEmail/balance', async function () {

    const res = await request
      .get(`/accounts/${userEmailUnChanged}/balance`)
      .send();
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.balance).to.be.a('number');
    expect(res.body.balance).to.equal(7825);
  });

  it('should create send transactions for an account POST to /transactions/:userEmail', async function () {

    const originalBalance = await request.get(`/accounts/${unlockedUser}/balance`).send();
    const res = await request
      .post(`/transactions`)
      .send({
        userEmail: unlockedUser,
        type: "send",
        amount: "10"
      });
    expect(res.status).to.equal(201);
    const updatedBalance = await request.get(`/accounts/${unlockedUser}/balance`).send();
    expect(parseInt(originalBalance.body.balance) - 10).to.equal(parseInt(updatedBalance.body.balance));

  });

  it('should create receive transactions for an account POST to /transactions/:userEmail', async function () {

    const originalBalance = await request.get(`/accounts/${unlockedUser}/balance`).send();
    const res = await request
      .post(`/transactions`)
      .send({
        userEmail: unlockedUser,
        type: "receive",
        amount: "10"
      });
    expect(res.status).to.equal(201);
    const updatedBalance = await request.get(`/accounts/${unlockedUser}/balance`).send();
    expect(parseInt(originalBalance.body.balance) + 10).to.equal(parseInt(updatedBalance.body.balance));
  });

  it('should not be possible to make an account negative POST to /transactions/:userEmail', async function () {

    let originalBalance = await request.get(`/accounts/${unlockedUser}/balance`).send();
    let makeNegativeAmount = parseInt(originalBalance.body.balance) + 1
    const res = await request
      .post(`/transactions`)
      .send({
        userEmail: unlockedUser,
        type: "send",
        amount: makeNegativeAmount
      });
    expect(res.status).to.equal(500);
    expect(res.text.indexOf("This transaction is rejected as will result in balance of $-1") > 0).to.be.true
  });

  it('should not be possible to post a transaction on a locked account POST to /transactions/:userEmail', async function () {

    const res = await request
      .post(`/transactions`)
      .send({
        userEmail: lockedUser,
        type: "send",
        amount: "10"
      });
    expect(res.status).to.equal(400);
    expect(res.text.indexOf("locked") > 0).to.be.true
  });

  it('should lock simultaneous transactions for an account POST to /transactions', async function () {

    const data = { userEmail: simulUser, amount: 1, type: "receive", createdAt: new Date() };

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
