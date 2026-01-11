import { Request, Response } from "express";
import { SensorService } from "../../../services/SensorService";

// GET /api/sensors/:id/readings - Get sensor readings with pagination
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10, start_date, end_date } = req.query;
            
            const sensorId = parseInt(id);

            if (isNaN(sensorId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid sensor ID'
                });
            }

            const startDate = start_date ? new Date(start_date as string) : undefined;
            const endDate = end_date ? new Date(end_date as string) : undefined;

            const result = await SensorService.getSensorReadings(
                sensorId,
                Number(page),
                Number(limit),
                startDate,
                endDate
            );

            res.json({
                status: true,
                data: result.readings,
                meta: result.meta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch sensor readings'
            });
        }
    }
];