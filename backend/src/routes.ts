/**
 * Main application routes
 */
import { Application } from 'express';

import account from './modules/account/account.router';
import user from './modules/user/route';
import report from './modules/report/router';

function routes(app: Application) {
  app.use('/account', account);
  app.use('/report', report);
  app.use('/user', user);
}

export default routes;