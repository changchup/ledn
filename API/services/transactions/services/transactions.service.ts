import TransactionsDao from '../daos/transactions.dao';
import { CreateTransactionDto } from '../dto/create.transaction.dto';

class TransactionsService{
    async validateAccountNotLocked(userEmail: string) {
      return TransactionsDao.validateAccountNotLocked(userEmail);
    }

    async create(resource: CreateTransactionDto) {
        return TransactionsDao.addTransaction(resource);
    }

    async getBalance(userEmail: string) {
      return TransactionsDao.getBalance(userEmail);
  }
}

export default new TransactionsService();