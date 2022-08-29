import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

const createEmail= `test.user+${shortid.generate()}@google.com`
const firstAccountBody = {
  userEmail: createEmail,
  status: 'locked', 
  createdAt: '2018-11-24T05:41:59.878Z',
  updatedAt: '2018-11-24T05:41:59.878Z'
};
let firstAccountIdTest = ''
const userEmail = "Rod.Wintheiser86@gmail.com"

describe('accounts endpoints', function () {
  let request: supertest.SuperAgentTest;

  before(function () {
    request = supertest.agent(app);
  });

  // after(function (done) {
  //   app.close(() => {
  //     mongoose.connection.close(done);
  //   });
  // });

  it('should allow a POST to /accounts', async function () {
    const res = await request.post('/accounts').send(firstAccountBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstAccountIdTest = res.body.id;
  });

  it('should return account details a GET from /accounts/:userEmail', async function () {
    const res = await request
      .get(`/accounts/${userEmail}`)
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body.status).to.equal(firstAccountBody.status);
    expect(res.body.updatedAt).to.equal(firstAccountBody.updatedAt);
    expect(res.body.createdAt).to.equal(firstAccountBody.createdAt);
    expect(res.body.userEmail).to.equal(userEmail);
  });

  it('should allow a PATCH to update status to active /accounts/:userEmail', async function () {
    const res = await request
      .patch(`/accounts/${createEmail}`)
      .send({status: "active"});
    expect(res.status).to.equal(204);
  });

  it('should have a status of active', async function () {
    const res = await request
      .get(`/accounts/${createEmail}`)
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.userEmail).to.equal(createEmail);
    expect(res.body.status).to.equal("active");
  });
});

// is update date working
// can i add duplicate emails
// can I set a status to another value 
// can I add other fields to account
// is email valid
// no transactions for user
// does account exist
// validate amount, email