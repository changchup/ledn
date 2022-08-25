import AccountsDao from '../daos/accounts.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateAccountDto } from '../dto/create.account.dto';
import { PatchAccountDto } from '../dto/patch.account.dto';

class AccountsService implements CRUD {
    async create(resource: CreateAccountDto) {
        return AccountsDao.addAccount(resource);
    }

    async patchById(id: string, resource: PatchAccountDto) : Promise<any> {
        return AccountsDao.updateAccountById(id, resource);
    }

    async readById(id: string) {
        return AccountsDao.getAccountById(id);
    }

    async getAccountByEmail(email: string) {
        return AccountsDao.getAccountByEmail(email);
    }
}

export default new AccountsService();