import express from 'express';
import transactionsService from '../services/transactions.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsController {

  async createTransaction(req: express.Request, res: express.Response, next: express.NextFunction) {
    transactionsService.create({ createdAt: new Date(), ...req.body })
      .then(transactionId => res.status(201).send({ id: transactionId }))
      .catch(err => next(err))
  }

  async getBalance(req: express.Request, res: express.Response, next: express.NextFunction) {
    transactionsService.getBalance(req.params.userEmail)
      .then(balance => res.status(201).send({ balance }))
      .catch(err => next(err))
  }
}

export default new TransactionsController();