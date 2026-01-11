import { Request, Response } from "express";
import { SensorService } from "../../services/SensorService";

// GET /api/sensors - Get all sensors with pagination
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, search } = req.query;

            const result = await SensorService.getAllSensors(
                Number(page),
                Number(limit),
                search as string
            );

            res.json({
                status: true,
                data: result.sensors,
                meta: result.meta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch sensors'
            });
        }
    }
];

// POST /api/sensors - Create new sensor
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { sensor_code, sensor_type, location, unit, min_threshold, max_threshold } = req.body;

            // Validate required fields
            if (!sensor_code || !sensor_type) {
                return res.status(400).json({
                    status: false,
                    error: 'sensor_code and sensor_type are required'
                });
            }

            // Check if sensor code already exists
            const existingSensor = await SensorService.getSensorByCode(sensor_code);
            if (existingSensor) {
                return res.status(409).json({
                    status: false,
                    error: 'Sensor with this code already exists'
                });
            }

            const sensor = await SensorService.createSensor({
                sensor_code,
                sensor_type,
                location,
                unit,
                min_threshold,
                max_threshold
            });

            res.status(201).json({
                status: true,
                data: sensor,
                message: 'Sensor created successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to create sensor'
            });
        }
    }
];
