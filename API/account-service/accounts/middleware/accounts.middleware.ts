import express from 'express';
import accountService from '../services/accounts.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:accounts-middleware');
class AccountsMiddleware {
  async validateRequiredAccountBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.userEmail) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required field email`,
      });
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const account = await accountService.getAccountByEmail(req.body.userEmail);
    if (account) {
      res.status(400).send({ error: `Account email already exists` });
    } else {
      next();
    }
  }

  async validateAccountExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const account = await accountService.readById(req.params.accountId);
    if (account) {
      next();
    } else {
      res.status(404).send({
        error: `Account ${req.params.accountId} not found`,
      });
    }
  }
}

export default new AccountsMiddleware();