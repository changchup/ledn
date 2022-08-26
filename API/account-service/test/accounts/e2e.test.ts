import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

const firstAccountBody = {
  userEmail: `test.user+${shortid.generate()}@google.com`,
  status: 'locked', 
  createdAt: new Date()
};
let firstAccountIdTest = ''

describe('accounts endpoints', function () {
  let request: supertest.SuperAgentTest;

  before(function () {
    request = supertest.agent(app);
  });

  after(function (done) {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it('should allow a POST to /accounts', async function () {
    const res = await request.post('/accounts').send(firstAccountBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstAccountIdTest = res.body.id;
  });

  it('should allow a GET from /accounts/:accountId', async function () {
    const res = await request
      .get(`/accounts/${firstAccountIdTest}`)
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body._id).to.equal(firstAccountIdTest);
    expect(res.body.userEmail).to.equal(firstAccountBody.userEmail);
  });

  it('should allow a PATCH to update status to active /accounts/:accountId', async function () {
    const res = await request
      .patch(`/accounts/${firstAccountIdTest}`)
      .send({status: "active"});
    expect(res.status).to.equal(204);
  });

  it('should have a status of active', async function () {
    const res = await request
      .get(`/accounts/${firstAccountIdTest}`)
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body._id).to.equal(firstAccountIdTest);
    expect(res.body.userEmail).to.equal(firstAccountBody.userEmail);
    expect(res.body.status).to.equal("active");
  });
});

// is update date working
// can i add duplicate emails
// can I set a status to another value 
// can I add other fields to account
// is email valid