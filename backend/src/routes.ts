/**
 * Main application routes
 */
import { Application } from 'express';

import account from './modules/account/account.router';

function routes(app: Application) {
  app.use('/account', account);
}

export default routes;