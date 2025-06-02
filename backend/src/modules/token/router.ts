import { Router } from 'express';
import { getTokenBySymbol } from './token.dao';

const router = Router();

router.get('/', async (req, res) => {
    const symbol = req.query.symbol as string;
    const token = await getTokenBySymbol(symbol);
    return res.send(token);
})


export default router