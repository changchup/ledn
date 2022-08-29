import { CommonRoutesConfig } from '../common/common.routes.config';
import TransactionsController from './controllers/transactions.controller';
import TransactionsMiddleware from './middleware/transactions.middleware';
import express from 'express';

export class TransactionsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'TransactionsRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/transactions`)
            .post(
                TransactionsMiddleware.validateRequiredTransactionBodyFields,
                TransactionsMiddleware.validateAccountNotLocked,
                TransactionsController.createTransaction
            );

            this.app
            .route(`/accounts/:userEmail/balance`)
            .get(
                TransactionsMiddleware.validateHasUserEmail,
                TransactionsController.getBalance
            );
        return this.app;
    }
}