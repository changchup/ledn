import express from 'express';
import accountsService from '../services/accounts.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:accounts-controller');
class AccountsController {

  async getAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
    const account = await accountsService.getAccount(req.params.userEmail).catch(err => next(err));
    res.status(200).send(account)
  }

  async createAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
    const accountId = await accountsService.create(req.body).catch(err => next(err));;
    res.status(201).send({ id: accountId });
  }

  async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
    await accountsService.patch(req.params.userEmail, req.body).catch(err => next(err));;
    res.status(204).send();
  }

}

export default new AccountsController();