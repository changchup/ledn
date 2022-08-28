import TransactionsDao from '../daos/transactions.dao';
import { CreateTransactionDto } from '../dto/create.transaction.dto';

class TransactionsService{
    async create(resource: CreateTransactionDto) {
        return TransactionsDao.addTransactionWithLock(resource);
    }

    async getBalance(userEmail: string) {
      return TransactionsDao.getBalance(userEmail);
  }
}

export default new TransactionsService();