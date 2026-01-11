import { Request, Response } from "express";
import { AlertService } from "../../services/AlertService";

// GET /api/alerts/stats - Get alert statistics
export const get = [
    async (req: Request, res: Response) => {
        try {
            const stats = await AlertService.getAlertStatistics();

            res.json({
                status: true,
                data: stats
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch alert statistics'
            });
        }
    }
];