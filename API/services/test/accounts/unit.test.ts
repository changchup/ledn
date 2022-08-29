import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { expect } from 'chai';
import AccountsDao from '../../accounts/daos/accounts.dao'
import { container } from 'tsyringe';
import MongooseService from '../../common/services/mongoose.service';


describe('accounts endpoints', async function () {
  it('should allow a POST to /accounts', async function () {
    const mongoServer = await MongoMemoryServer.create();


  await mongoose.connect(mongoServer.getUri(), { });
  
  container.registerInstance(MongooseService.getMongoose(), mongoose);
  
  const l = await AccountsDao.addAccount({
    userEmail: 'hamish@hotmail.com',
    createdAt: new Date(), 
    updatedAt: new Date()
  })
  console.log(l)
    const t = await AccountsDao.getAccountById(l)
    console.log(t)
    

  // your code here
  console.log("hi")
  const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    let cnt = await User.count();
    console.log(cnt)
    expect(cnt).to.equal(0);
    console.log("hi")
    var temp = new User({name: 'tet'})
    await temp.save();
    cnt = await User.count();
    console.log(cnt)
    expect(cnt).to.equal(1);
  await mongoose.disconnect();
  });

  // it('eee', async function () {
  //   container.registerInstance(MongooseService.getMongoose(), mongoose);
  //   const t = await AccountsDao.getAccountById("xkat7r55gO")
  //   console.log(t)
  // })
});


// is update date working
// can i add duplicate emails
// can I set a status to another value 
// can I add other fields to account
// is email valid