import { Request, Response } from "express";
import { SensorService } from "../../services/SensorService";

// GET /api/sensors/:id - Get sensor by ID
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sensorId = parseInt(id);

            if (isNaN(sensorId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid sensor ID'
                });
            }

            const sensor = await SensorService.getSensorById(sensorId);

            if (!sensor) {
                return res.status(404).json({
                    status: false,
                    error: 'Sensor not found'
                });
            }

            res.json({
                status: true,
                data: sensor
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch sensor'
            });
        }
    }
];

// PUT /api/sensors/:id - Update sensor
export const put = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sensorId = parseInt(id);

            if (isNaN(sensorId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid sensor ID'
                });
            }

            const existingSensor = await SensorService.getSensorById(sensorId);
            if (!existingSensor) {
                return res.status(404).json({
                    status: false,
                    error: 'Sensor not found'
                });
            }

            const updatedSensor = await SensorService.updateSensor(sensorId, req.body);

            res.json({
                status: true,
                data: updatedSensor,
                message: 'Sensor updated successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to update sensor'
            });
        }
    }
];

// DELETE /api/sensors/:id - Delete sensor
export const del = [
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sensorId = parseInt(id);

            if (isNaN(sensorId)) {
                return res.status(400).json({
                    status: false,
                    error: 'Invalid sensor ID'
                });
            }

            const existingSensor = await SensorService.getSensorById(sensorId);
            if (!existingSensor) {
                return res.status(404).json({
                    status: false,
                    error: 'Sensor not found'
                });
            }

            await SensorService.deleteSensor(sensorId);

            res.json({
                status: true,
                message: 'Sensor deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to delete sensor'
            });
        }
    }
];