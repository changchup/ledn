import TransactionsDao from '../daos/transactions.dao';
import { CreateTransactionDto } from '../dto/create.transaction.dto';

class TransactionsService{
    async create(resource: CreateTransactionDto) {
        return TransactionsDao.addTransactionWithLock(resource);
    }
}

export default new TransactionsService();