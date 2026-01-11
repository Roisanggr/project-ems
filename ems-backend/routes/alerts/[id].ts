import { Request, Response } from "express";
import { AlertService } from "../../services/AlertService";

// GET /api/alerts/:id - Get alert by ID
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const alertId = parseInt(id);

            if (isNaN(alertId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid alert ID'
                });
            }

            const alert = await AlertService.getAlertById(alertId);

            if (!alert) {
                return res.status(404).json({
                    status: false,
                    error: 'Alert not found'
                });
            }

            res.json({
                status: true,
                data: alert
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch alert'
            });
        }
    }
];

// PUT /api/alerts/:id - Resolve alert
export const put = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { notes } = req.body;
            const alertId = parseInt(id);

            if (isNaN(alertId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid alert ID'
                });
            }

            const existingAlert = await AlertService.getAlertById(alertId);
            if (!existingAlert) {
                return res.status(404).json({
                    status: false,
                    error: 'Alert not found'
                });
            }

            const resolvedAlert = await AlertService.resolveAlert(alertId, notes);

            res.json({
                status: true,
                data: resolvedAlert,
                message: 'Alert resolved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to resolve alert'
            });
        }
    }
];