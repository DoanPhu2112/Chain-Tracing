/**
 * Main application routes
 */
import { Application } from 'express';

import account from './modules/account';

function routes(app: Application) {
  app.use('/account', () => {console.log("ABC")});
}

export default routes;