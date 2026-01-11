import { Request, Response } from "express";
import { SensorService } from "../../services/SensorService";

// POST /api/iot/sensor-data - Record comprehensive sensor data from IoT system
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { 
                room_temp, 
                room_hum, 
                rack_temp, 
                rack_hum, 
                flame_detected, 
                buzzer_state, 
                response_time_ms 
            } = req.body;

            // Validate device key
            const deviceKey = req.headers['x-device-key'];
            const expectedKey = process.env.IOT_DEVICE_KEY || 'iot-device-key-2024';
            
            if (deviceKey !== expectedKey) {
                return res.status(401).json({
                    status: false,
                    error: 'Invalid device key'
                });
            }

            await SensorService.recordSensorData({
                room_temp: room_temp ? Number(room_temp) : undefined,
                room_hum: room_hum ? Number(room_hum) : undefined,
                rack_temp: rack_temp ? Number(rack_temp) : undefined,
                rack_hum: rack_hum ? Number(rack_hum) : undefined,
                flame_detected: flame_detected !== undefined ? Boolean(flame_detected) : undefined,
                buzzer_state: buzzer_state !== undefined ? Boolean(buzzer_state) : undefined,
                response_time_ms: response_time_ms ? Number(response_time_ms) : undefined
            });

            res.json({
                status: true,
                message: 'Sensor data recorded successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to record sensor data'
            });
        }
    }
];

// GET /api/iot/sensor-data - Get latest sensor data
export const get = [
    async (req: Request, res: Response) => {
        try {
            const { limit = 10 } = req.query;

            const data = await SensorService.getLatestSensorData(Number(limit));

            res.json({
                status: true,
                data
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch sensor data'
            });
        }
    }
];