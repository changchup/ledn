import { CreateTransactionDto } from '../dto/create.transaction.dto';
import shortid from 'shortid';
import debug from 'debug';
import MongooseService from '../../common/services/mongoose.service';
import { container } from 'tsyringe';

const log: debug.IDebugger = debug('app:transactions-dao');

class TransactionsDao {

  mongooseService = container.resolve(MongooseService);

  Schema = this.mongooseService.getMongoose().Schema;

  transactionSchema = new this.Schema({
    _id: String,
    userEmail: { type: String, unique: true, required: true },
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

}

export default new TransactionsDao();