import { CreateAccountDto } from '../dto/create.account.dto';
import mongooseService from '../../common/services/mongoose.service';

import shortid from 'shortid';
import debug from 'debug';
import { PatchAccountDto } from '../dto/patch.account.dto';

const log: debug.IDebugger = debug('app:accounts-dao');

class AccountsDao {
  Schema = mongooseService.getMongoose().Schema;

  accountSchema = new this.Schema({
    _id: String,
    userEmail: String,
    status: String,
    updatedAt: Date,
    createdAt: Date,
  }, { id: false });

  Account = mongooseService.getMongoose().model('Accounts', this.accountSchema);

  constructor() {
    log('Created new instance of AccountsDao');
  }

  async addAccount(accountFields: CreateAccountDto) {
    const accountId = shortid.generate();
    const account = new this.Account({
      _id: accountId,
      ...accountFields,
    });
    await account.save();
    return accountId;
  }

  async getAccountByEmail(email: string) {
    return this.Account.findOne({ userEmail: email }).exec();
  }

  async getAccountById(accountId: string) {
    return this.Account.findOne({ _id: accountId }).populate('status').exec();
  }

  async getAccounts(limit = 25, page = 0) {
    return this.Account.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  async updateAccountById(
    accountId: string,
    accountFields: PatchAccountDto
  ) {
    const existingAccount = await this.Account.findOneAndUpdate(
      { _id: accountId },
      { $set: accountFields },
      { new: true }
    ).exec();

    return existingAccount;
  }

}

export default new AccountsDao();