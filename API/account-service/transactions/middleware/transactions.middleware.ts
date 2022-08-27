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

}

export default new TransactionsMiddleware();