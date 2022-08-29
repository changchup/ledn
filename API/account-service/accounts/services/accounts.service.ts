import AccountsDao from '../daos/accounts.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateAccountDto } from '../dto/create.account.dto';
import { PatchAccountDto } from '../dto/patch.account.dto';

class AccountsService {
    async create(resource: CreateAccountDto) {
        return AccountsDao.addAccount(resource);
    }

    async patch(id: string, resource: PatchAccountDto) : Promise<any> {
        return AccountsDao.updateAccount(id, resource);
    }

    async getAccount(id: string) {
        return AccountsDao.getAccount(id);
    }
}

export default new AccountsService();