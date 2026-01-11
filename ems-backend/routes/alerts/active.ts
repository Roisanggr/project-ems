import { Request, Response } from "express";
import { AlertService } from "../../services/AlertService";

// GET /api/alerts/active - Get active alerts
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { limit = 10 } = req.query;

            const alerts = await AlertService.getActiveAlerts(Number(limit));

            res.json({
                status: true,
                data: alerts
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch active alerts'
            });
        }
    }
];