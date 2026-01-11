import { executeQuery, executeTransaction } from '../utils/db1';
import { Alert, AlertLog } from '../types/database';

export class AlertService {
  // Get all alerts with pagination and filters
  static async getAllAlerts(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean,
    sensor_id?: number,
    alert_type?: string
  ) {
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (isActive !== undefined) {
      whereClause += ' AND a.is_active = ?';
      params.push(isActive);
      
      if (isActive) {
        whereClause += ' AND a.alert_off IS NULL';
      }
    }
    
    if (sensor_id) {
      whereClause += ' AND a.sensor_id = ?';
      params.push(sensor_id);
    }
    
    if (alert_type) {
      whereClause += ' AND a.alert_type = ?';
      params.push(alert_type);
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM alerts a ${whereClause}`;
    const dataQuery = `
      SELECT a.*, s.sensor_code, s.sensor_type, s.location, s.unit
      FROM alerts a
      JOIN sensors s ON a.sensor_id = s.id
      ${whereClause}
      ORDER BY a.alert_on DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [countResult, alerts] = await Promise.all([
      executeQuery(countQuery, params),
      executeQuery(dataQuery, [...params, limit, offset])
    ]);

    return {
      alerts,
      meta: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Get alert by ID
  static async getAlertById(id: number): Promise<Alert | null> {
    const query = `
      SELECT a.*, s.sensor_code, s.sensor_type, s.location, s.unit
      FROM alerts a
      JOIN sensors s ON a.sensor_id = s.id
      WHERE a.id = ?
    `;
    const alerts = await executeQuery(query, [id]);
    return alerts.length > 0 ? alerts[0] : null;
  }

  // Create new alert
  static async createAlert(alertData: {
    sensor_id: number;
    alert_type: string;
    value?: number;
    threshold?: number;
  }): Promise<Alert> {
    const query = `
      INSERT INTO alerts (sensor_id, alert_type, value, threshold, alert_on, is_active, timestamp)
      VALUES (?, ?, ?, ?, NOW(), true, NOW())
    `;
    
    const result = await executeQuery(query, [
      alertData.sensor_id,
      alertData.alert_type,
      alertData.value,
      alertData.threshold
    ]);

    const createdAlert = await this.getAlertById(result.insertId);
    if (!createdAlert) {
      throw new Error('Failed to create alert');
    }
    return createdAlert;
  }

  // Resolve alert
  static async resolveAlert(id: number, notes?: string): Promise<Alert> {
    const queries = [
      {
        query: 'UPDATE alerts SET is_active = false, alert_off = NOW() WHERE id = ?',
        params: [id]
      }
    ];

    // Log the alert action
    if (notes) {
      queries.push({
        query: 'INSERT INTO alert_logs (alert_id, action, notes, timestamp) VALUES (?, ?, ?, NOW())',
        params: [id,]
      });
    }

    await executeTransaction(queries);
    
    const resolvedAlert = await this.getAlertById(id);
    if (!resolvedAlert) {
      throw new Error('Alert not found after resolution');
    }
    return resolvedAlert;
  }

  // Get active alerts
  static async getActiveAlerts(limit: number = 10) {
    const query = `
      SELECT a.*, s.sensor_code, s.sensor_type, s.location
      FROM alerts a
      JOIN sensors s ON a.sensor_id = s.id
      WHERE a.is_active = true AND a.alert_off IS NULL
      ORDER BY a.alert_on DESC
      LIMIT ?
    `;
    
    return await executeQuery(query, [limit]);
  }

  // Get alert statistics
  static async getAlertStatistics() {
    const queries = [
      'SELECT COUNT(*) as total FROM alerts',
      'SELECT COUNT(*) as active FROM alerts WHERE is_active = true AND alert_off IS NULL',
      'SELECT COUNT(*) as resolved FROM alerts WHERE is_active = false',
      'SELECT alert_type, COUNT(*) as count FROM alerts GROUP BY alert_type'
    ];

    const [total, active, resolved, byType] = await Promise.all(
      queries.map(query => executeQuery(query))
    );

    return {
      total: total[0].total,
      active: active[0].active,
      resolved: resolved[0].resolved,
      by_type: byType
    };
  }
}