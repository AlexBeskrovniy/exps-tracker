import { Router } from 'express';
import { Total } from '../models/total.mjs';
import { getTotalSpent } from '../utils/spent-handler.mjs';

const router = Router();

router
    .get('/total', async (req, res) => {
        try {
            const total = await getTotalSpent();
            console.log(total);
            return res.status(200).json({total: total});
        } catch (err) {
            console.error(err);
        }
    });

export default router;