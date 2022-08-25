import { CreateAccountDto } from '../dto/create.account.dto';
import mongooseService from '../../common/services/mongoose.service';

import shortid from 'shortid';
import debug from 'debug';
import { PatchAccountDto } from '../dto/patch.account.dto';
import { AccountStatus } from '../../common/enums/accountStatus.enum';

const log: debug.IDebugger = debug('app:accounts-dao');

class AccountsDao {
  Schema = mongooseService.getMongoose().Schema;

  accountSchema = new this.Schema({
    _id: String,
    userEmail: { type: String, unique: true, required: true },
    status: { type: String, required: true, default: AccountStatus.LOCKED },
    updatedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  }, { id: false });

  Account = mongooseService.getMongoose().model('Accounts', this.accountSchema);

  constructor() {
    log('Created new instance of AccountsDao');
  }

  async addAccount(accountFields: CreateAccountDto) {

    // initialize account in locked state
    const now = new Date();
    const accountId = shortid.generate();
    const account = new this.Account({
      _id: accountId,
      userEmail: accountFields.userEmail,
      status: AccountStatus.LOCKED,
      updatedAt: now,
      createdAt: now
    });
    await account.save();
    return accountId;
  }

  async getAccountByEmail(email: string) {
    return this.Account.findOne({ userEmail: email }).exec();
  }

  async getAccountById(accountId: string) {
    return this.Account.findOne({ _id: accountId }).exec();
  }

  async updateAccountById(
    accountId: string,
    accountFields: PatchAccountDto
  ) {
    accountFields.updatedAt = new Date()
    const existingAccount = await this.Account.findOneAndUpdate(
      { _id: accountId },
      { $set: accountFields },
      { new: true }
    ).exec();

    return existingAccount;
  }

}

export default new AccountsDao();