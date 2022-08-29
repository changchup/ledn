import express from 'express';
import transactionService from '../services/transactions.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsMiddleware {
  async validateRequiredTransactionBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.type && req.body.amount && req.body.userEmail) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required fields type, amount and userEmail`,
      });
    }
  }

  async validateHasUserEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.params && req.params.userEmail) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required field userEmail`,
      });
    }
  }

  async validateAccountNotLocked(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const notLocked = await transactionService.validateAccountNotLocked(req.body.userEmail);
    if (notLocked) {
      next();
    } else {
      res.status(400).send({
        error: `Account ${req.body.userEmail} locked`,
      });
    }
  }
}

export default new TransactionsMiddleware();