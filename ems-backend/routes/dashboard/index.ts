import { Request, Response } from "express";
import { SensorService } from "../../services/SensorService";
import { AlertService } from "../../services/AlertService";
import { executeQuery } from "../../utils/db1";

// GET /api/dashboard - Get dashboard summary data
export const get = [
    async (req: Request, res: Response) => {
        try {
            // Get sensor statistics
            const sensorStats = await Promise.all([
                executeQuery('SELECT COUNT(*) as total FROM sensors'),
                executeQuery('SELECT COUNT(DISTINCT sensor_id) as active FROM sensor_logs WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)'),
                executeQuery('SELECT COUNT(*) as alerts FROM alerts WHERE is_active = true AND alert_off IS NULL')
            ]);

            // Get recent sensor data
            const recentSensorData = await SensorService.getLatestSensorData(5);

            // Get active alerts
            const activeAlerts = await AlertService.getActiveAlerts(5);

            // Get alert statistics
            const alertStats = await AlertService.getAlertStatistics();

            // Determine system status
            let systemStatus = 'NORMAL';
            const alertCount = sensorStats[2][0].alerts;
            if (alertCount > 0) {
                systemStatus = alertCount > 5 ? 'CRITICAL' : 'WARNING';
            }

            const dashboardData = {
                sensors: {
                    total: sensorStats[0][0].total,
                    active: sensorStats[1][0].active,
                    alerts: alertCount
                },
                recent_readings: recentSensorData,
                active_alerts: activeAlerts,
                system_status: systemStatus,
                alert_statistics: alertStats,
                last_updated: new Date().toISOString()
            };

            res.json({
                status: true,
                data: dashboardData
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
            });
        }
    }
];