import { CreateTransactionDto } from '../dto/create.transaction.dto';
import shortid from 'shortid';
import debug from 'debug';
import MongooseService from '../../common/services/mongoose.service';
import { container } from 'tsyringe';
import Locks from '../locks/locks';

const log: debug.IDebugger = debug('app:transactions-dao');

class TransactionsDao {

  mongooseService = container.resolve(MongooseService);
  locks = container.resolve(Locks);
  lockId: string = ""

  Schema = this.mongooseService.getMongoose().Schema;

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
    const transactionId = shortid.generate();
    const transaction = new this.Transaction({
      _id: transactionId,
      ...transactionFields
    });
    await transaction.save();
    return transactionId;
  }

  async addTransactionWithLock(transactionFields: CreateTransactionDto) {
    const userEmail = transactionFields.userEmail
    try {
      this.lockId = await this.locks.getLock(userEmail)
    } catch (err) {
      log(` ${userEmail} locked`)
      throw new Error((err as Error).message)
    }
    const transactionId = await this.addTransaction(transactionFields)
    try {
      await this.locks.releaseLock(userEmail, this.lockId)
      log(` ${userEmail} lock released`)
    } catch {
      log(`Account ${userEmail} lock not released`);
    }
    return transactionId
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

    return receive.amount - send.amount
  }

}

export default new TransactionsDao();