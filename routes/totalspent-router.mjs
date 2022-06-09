import { Router } from 'express';
import { getTotalSpent, getSpentInfo } from '../utils/spent-handler.mjs';

const router = Router();

router
    .get('/total', async (req, res) => {
        try {
            const total = await getTotalSpent();
            res.status(200).json({total: total});
        } catch (err) {
            console.error(err);
        }
    })
    .get('/infochart', async (req, res) => {
        try {
            const info = await getSpentInfo();
            res.status(200).send(info);
        } catch (err) {
            console.error(err);
        }
    });

export default router;