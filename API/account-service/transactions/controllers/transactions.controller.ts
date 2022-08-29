import express from 'express';
import transactionsService from '../services/transactions.service';
import debug from 'debug';
import Locks from '../locks/locks';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsController {

  async createTransaction(req: express.Request, res: express.Response, next: express.NextFunction) {
    let lockId: string = ""
    try {
      lockId = Locks.getLock(req.body.userEmail)
      const transactionId = await transactionsService.create({ createdAt: new Date(), ...req.body })
      res.status(201).send({ id: transactionId })
    } catch (err) {
      next(err)
    } finally {
      Locks.releaseLock(req.body.userEmail, lockId)
    }
  }

  async getBalance(req: express.Request, res: express.Response, next: express.NextFunction) {
    transactionsService.getBalance(req.params.userEmail)
      .then(balance => res.status(201).send({ balance }))
      .catch(err => next(err))
  }
}

export default new TransactionsController();