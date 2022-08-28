import express from 'express';
import transactionsService from '../services/transactions.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsController {

  async createTransaction(req: express.Request, res: express.Response) {
    try {
      const transactionId = await transactionsService.create({ createdAt: new Date(), ...req.body });
      res.status(201).send({ id: transactionId });
    } catch (err) {
      res.status(503).send((err as Error).message)
    }
  }

  async getBalance(req: express.Request, res: express.Response) {
    try {
      const balance = await transactionsService.getBalance(req.params.userEmail );
      res.status(201).send({ balance });
    } catch (err) {
      res.status(503).send((err as Error).message)
    }
  }

}

export default new TransactionsController();