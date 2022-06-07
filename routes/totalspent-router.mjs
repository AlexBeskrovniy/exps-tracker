import { Router } from 'express';
import { getStatistics, getTotalSpent } from '../utils/spent-handler.mjs';

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
    .get('/stats', async (req, res) => {
        try {
            const stats = await getStatistics();
            res.status(200).json({...stats._doc});
        } catch (err) {
            console.error(err);
        }
    });

export default router;