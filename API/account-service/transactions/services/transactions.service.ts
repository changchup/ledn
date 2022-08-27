import TransactionsDao from '../daos/transactions.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateTransactionDto } from '../dto/create.transaction.dto';

class TransactionsService{
    async create(resource: CreateTransactionDto) {
        return TransactionsDao.addTransaction(resource);
    }
}

export default new TransactionsService();