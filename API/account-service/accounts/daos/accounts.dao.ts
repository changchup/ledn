import { CreateAccountDto } from '../dto/create.account.dto';
import MongooseService from '../../common/services/mongoose.service';

import shortid from 'shortid';
import debug from 'debug';
import { PatchAccountDto } from '../dto/patch.account.dto';
import { AccountStatus } from '../../common/enums/accountStatus.enum';
import { container, injectable, singleton } from 'tsyringe';

const log: debug.IDebugger = debug('app:accounts-dao');

@injectable()
class AccountsDao {
  
  mongooseService = container.resolve(MongooseService);
  
  Schema = this.mongooseService.getMongoose().Schema;

  accountSchema = new this.Schema({
    _id: String,
    userEmail: { type: String, unique: true, required: true },
    status: { type: String, required: true, default: AccountStatus.LOCKED },
    updatedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  }, { id: false });

  Account = this.mongooseService.getMongoose().model('Accounts', this.accountSchema);

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

  async getAccount(userEmail: string) {
    return this.Account.findOne({ userEmail: userEmail }).exec();
  }

  async getAccountById(accountId: string) {
    return this.Account.findOne({ _id: accountId }).exec();
  }

  async updateAccount(
    userEmail: string,
    accountFields: PatchAccountDto
  ) {
    accountFields.updatedAt = new Date()
    const existingAccount = await this.Account.findOneAndUpdate(
      { userEmail: userEmail },
      { $set: accountFields },
      { new: true }
    ).exec();

    return existingAccount;
  }

}

export default new AccountsDao();