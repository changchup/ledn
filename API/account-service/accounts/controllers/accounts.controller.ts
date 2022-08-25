import express from 'express';
import accountsService from '../services/accounts.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:accounts-controller');
class AccountsController {

  async getAccountById(req: express.Request, res: express.Response) {
    const account = await accountsService.readById(req.params.accountId);
    res.status(200).send(account);
  }

  async createAccount(req: express.Request, res: express.Response) {
    const accountId = await accountsService.create(req.body);
    res.status(201).send({ id: accountId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await accountsService.patchById(req.params.accountId, req.body));
    res.status(204).send();
  }

}

export default new AccountsController();