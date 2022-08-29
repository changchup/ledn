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
      .post(
        AccountsMiddleware.validateRequiredAccountBodyFields,
        AccountsMiddleware.validateSameEmailDoesntExist,
        AccountsController.createAccount
      );

    this.app
      .route(`/accounts/:userEmail`)
      .all(AccountsMiddleware.validateAccountExists)
      .get(AccountsController.getAccount);

    this.app.patch(`/accounts/:userEmail`, [
      AccountsController.patch,
    ]);

    return this.app;
  }

}