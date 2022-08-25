import express from 'express';
import accountsService from '../services/accounts.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:accounts-controller');
class AccountsController {
  async listAccounts(req: express.Request, res: express.Response) {
    const accounts = await accountsService.list(100, 0);
    res.status(200).send(accounts);
  }

  async getAccountById(req: express.Request, res: express.Response) {
    const account = await accountsService.readById(req.body.id);
    res.status(200).send(account);
  }

  async createAccount(req: express.Request, res: express.Response) {
    const accountId = await accountsService.create(req.body);
    res.status(201).send({ id: accountId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await accountsService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

}

export default new AccountsController();