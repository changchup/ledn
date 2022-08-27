import express from 'express';
import transactionsService from '../services/transactions.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:transactions-controller');
class TransactionsController {

    async createTransaction(req: express.Request, res: express.Response) {
        const transactionId = await transactionsService.create({createdAt: new Date(), ...req.body});
        res.status(201).send({ id: transactionId });
    }

}

export default new TransactionsController();