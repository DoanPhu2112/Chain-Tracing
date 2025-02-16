import { Router } from "express";

const router = Router();
router.get('/graph', (req, res) => {
    const { address } = req.params;
    const {
        startTimestamp,
        endTimestamp,
    } = req.query;
});
