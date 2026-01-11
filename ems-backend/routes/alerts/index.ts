import { Request, Response } from "express";
import { AlertService } from "../../services/AlertService";

// GET /api/alerts - Get all alerts with pagination and filters
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                is_active, 
                sensor_id, 
                alert_type 
            } = req.query;

            const result = await AlertService.getAllAlerts(
                Number(page),
                Number(limit),
                is_active !== undefined ? Boolean(is_active === 'true') : undefined,
                sensor_id ? Number(sensor_id) : undefined,
                alert_type as string
            );

            res.json({
                status: true,
                data: result.alerts,
                meta: result.meta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch alerts'
            });
        }
    }
];

// POST /api/alerts - Create new alert
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { sensor_id, alert_type, value, threshold } = req.body;

            // Validate required fields
            if (!sensor_id || !alert_type) {
                return res.status(400).json({
                    status: false,
                    error: 'sensor_id and alert_type are required'
                });
            }

            const alert = await AlertService.createAlert({
                sensor_id: Number(sensor_id),
                alert_type,
                value: value ? Number(value) : undefined,
                threshold: threshold ? Number(threshold) : undefined
            });

            res.status(201).json({
                status: true,
                data: alert,
                message: 'Alert created successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to create alert'
            });
        }
    }
];