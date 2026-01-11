import { Request, Response } from "express";
import { SensorService } from "../../services/SensorService";

// POST /api/iot/sensor-reading - Record single sensor reading from IoT device
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { sensor_code, value, response_time_ms, timestamp } = req.body;

            // Validate required fields
            if (!sensor_code || value === undefined) {
                return res.status(400).json({
                    status: false,
                    error: 'sensor_code and value are required'
                });
            }

            // Validate device key (simple authentication for IoT devices)
            const deviceKey = req.headers['x-device-key'];
            const expectedKey = process.env.IOT_DEVICE_KEY || 'iot-device-key-2024';
            
            if (deviceKey !== expectedKey) {
                return res.status(401).json({
                    status: false,
                    error: 'Invalid device key'
                });
            }

            await SensorService.recordSensorReading({
                sensor_code,
                value: Number(value),
                response_time_ms: response_time_ms ? Number(response_time_ms) : undefined,
                timestamp: timestamp ? new Date(timestamp) : undefined
            });

            res.json({
                status: true,
                message: 'Sensor reading recorded successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to record sensor reading'
            });
        }
    }
];