import { CommonRoutesConfig } from '../common/common.routes.config';
import AccountsController from './controllers/accounts.controller';
import AccountsMiddleware from './middleware/accounts.middleware';
import express from 'express';

export class AccountsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AccountsRoutes');
  }

  configureRoutes(): express.Application {
    this.app
      .route(`/accounts`)
      .get(AccountsController.listAccounts)
      .post(
        AccountsMiddleware.validateRequiredAccountBodyFields,
        AccountsMiddleware.validateSameEmailDoesntExist,
        AccountsController.createAccount
      );

    this.app
      .route(`/accounts/:accountId`)
      .all(AccountsMiddleware.validateAccountExists)
      .get(AccountsController.getAccountById);

    // this.app.put(`/accounts/:accountId`, [
    //     AccountsMiddleware.validateRequiredAccountBodyFields,
    //     AccountsController.put,
    // ]);

    this.app.patch(`/accounts/:accountId`, [
      AccountsController.patch,
    ]);

    return this.app;
  }

}