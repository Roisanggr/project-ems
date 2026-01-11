import { Request, Response } from "express";
import { executeQuery } from "../../utils/db1";

// POST /api/iot/buzzer - Control buzzer state
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { is_active } = req.body;

            // Validate device key
            const deviceKey = req.headers['x-device-key'];
            const expectedKey = process.env.IOT_DEVICE_KEY || 'iot-device-key-2024';
            
            if (deviceKey !== expectedKey) {
                return res.status(401).json({
                    status: false,
                    error: 'Invalid device key'
                });
            }

            if (is_active === undefined) {
                return res.status(400).json({
                    status: false,
                    error: 'is_active field is required'
                });
            }

            const query = 'INSERT INTO buzzer (is_active, timestamp) VALUES (?, NOW())';
            await executeQuery(query, [Boolean(is_active)]);

            res.json({
                status: true,
                message: 'Buzzer state updated successfully',
                data: {
                    is_active: Boolean(is_active),
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to update buzzer state'
            });
        }
    }
];

// GET /api/iot/buzzer - Get latest buzzer state
export const get = [
    async (req: Request, res: Response) => {
        try {
            const query = 'SELECT * FROM buzzer ORDER BY timestamp DESC LIMIT 1';
            const result = await executeQuery(query);

            res.json({
                status: true,
                data: result.length > 0 ? result[0] : null
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch buzzer state'
            });
        }
    }
];