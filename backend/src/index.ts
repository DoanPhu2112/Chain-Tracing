import express from 'express';
import cors from 'cors'

import routes from './routes';
import { errorHandler } from 'src/middleware/errorHandler';

import camelCaseReq from 'src/middleware/format/camelcaseReq';
import omitReq from 'src/middleware/format/omitReq';
import snakecaseRes from 'src/middleware/format/snakecaseRes';

import 'dotenv/config';

const app = express();
const port: number = 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(camelCaseReq);
app.use(omitReq);
app.use(snakecaseRes);

routes(app)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});