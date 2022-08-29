import { CreateTransactionDto } from '../dto/create.transaction.dto';
import shortid from 'shortid';
import debug from 'debug';
import MongooseService from '../../common/services/mongoose.service';
import { container } from 'tsyringe';
import Locks from '../locks/locks';
// todo refactor to own domain or graphql...
import AccountsDao from '../../accounts/daos/accounts.dao'

const log: debug.IDebugger = debug('app:transactions-dao');

class TransactionsDao {

  mongooseService = container.resolve(MongooseService);
  //accountService = container.resolve(AccountsDao);
  //locks = container.resolve(Locks);
  lockId: string = ""

  Schema = MongooseService.getMongoose().Schema;

  transactionSchema = new this.Schema({
    _id: String,
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, required: true },
  }, { id: false });

  Transaction = this.mongooseService.getMongoose().model('Transactions', this.transactionSchema);

  constructor() {
    log('Created new instance of TransactionsDao');
  }

  async addTransaction(transactionFields: CreateTransactionDto) {
    await this.checkBalance(transactionFields)
    const transactionId = shortid.generate();
    const transaction = new this.Transaction({
      _id: transactionId,
      ...transactionFields
    });
    await transaction.save();
    return transactionId;
  }

  async checkBalance(transactionFields: CreateTransactionDto) {
    const resultAfterTransaction = await this.getBalance(transactionFields.userEmail) - transactionFields.amount
    if (transactionFields.type === 'send' && resultAfterTransaction < 0) {
      throw Error(`This transaction is rejected as will result in balance of $${resultAfterTransaction}`)
    }
  }

  async validateAccountNotLocked(userEmail: string) {
    const result: any = await AccountsDao.Account.findOne({ userEmail });
    if (result && result.status === 'locked') {
      return false
    }
    return true
  }

  async getBalance(userEmail: string) {
    const result = await this.Transaction.aggregate([
      {
        "$match": { "userEmail": userEmail }
      },
      {
        "$group": { _id: "$type", amount: { $sum: "$amount" } }
      }],
    );

    const receive = result.find(item => item._id === 'receive')
    const send = result.find(item => item._id === 'send')

    return receive.amount - ((typeof send !== "undefined") ? send.amount : 0);
  }

}

export default new TransactionsDao();