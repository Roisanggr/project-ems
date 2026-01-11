import { executeQuery, executeTransaction } from '../utils/db1';
import { Sensor, SensorData, SensorLog, ApiResponse } from '../types/database';

export class SensorService {
  // Get all sensors with pagination
  static async getAllSensors(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const params: any[] = [];
    
    if (search) {
      whereClause = 'WHERE (sensor_code LIKE ? OR sensor_type LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM sensors ${whereClause}`;
    const dataQuery = `
      SELECT s.*, ss.is_safe, ss.last_value, ss.timestamp as last_update
      FROM sensors s 
      LEFT JOIN sensor_status ss ON s.id = ss.sensor_id 
      ${whereClause}
      ORDER BY s.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [countResult, sensors] = await Promise.all([
      executeQuery(countQuery, params),
      executeQuery(dataQuery, [...params, limit, offset])
    ]);

    return {
      sensors,
      meta: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Get sensor by ID
  static async getSensorById(id: number): Promise<Sensor | null> {
    const query = 'SELECT * FROM sensors WHERE id = ?';
    const sensors = await executeQuery(query, [id]);
    return sensors.length > 0 ? sensors[0] : null;
  }

  // Get sensor by code
  static async getSensorByCode(sensor_code: string): Promise<Sensor | null> {
    const query = 'SELECT * FROM sensors WHERE sensor_code = ?';
    const sensors = await executeQuery(query, [sensor_code]);
    return sensors.length > 0 ? sensors[0] : null;
  }

  // Create new sensor
  static async createSensor(sensorData: Partial<Sensor>): Promise<Sensor> {
    const query = `
      INSERT INTO sensors (sensor_code, sensor_type, location, unit, min_threshold, max_threshold, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const result = await executeQuery(query, [
      sensorData.sensor_code,
      sensorData.sensor_type,
      sensorData.location,
      sensorData.unit,
      sensorData.min_threshold,
      sensorData.max_threshold
    ]);

    const createdSensor = await this.getSensorById(result.insertId);
    if (!createdSensor) {
      throw new Error('Failed to create sensor');
    }
    return createdSensor;
  }

  // Update sensor
  static async updateSensor(id: number, sensorData: Partial<Sensor>): Promise<Sensor> {
    const updates: string[] = [];
    const params: any[] = [];

    const updateFields = ['sensor_code', 'sensor_type', 'location', 'unit', 'min_threshold', 'max_threshold'];
    
    for (const field of updateFields) {
      if (sensorData[field as keyof Sensor] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(sensorData[field as keyof Sensor]);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid update fields provided');
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const query = `UPDATE sensors SET ${updates.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);

    const updatedSensor = await this.getSensorById(id);
    if (!updatedSensor) {
      throw new Error('Sensor not found after update');
    }
    return updatedSensor;
  }

  // Delete sensor
  static async deleteSensor(id: number): Promise<void> {
    const query = 'DELETE FROM sensors WHERE id = ?';
    await executeQuery(query, [id]);
  }

  // Record sensor reading (for IoT devices)
  static async recordSensorReading(reading: {
    sensor_code: string;
    value: number;
    response_time_ms?: number;
    timestamp?: Date;
  }): Promise<void> {
    const sensor = await this.getSensorByCode(reading.sensor_code);
    if (!sensor) {
      throw new Error(`Sensor with code ${reading.sensor_code} not found`);
    }

    const timestamp = reading.timestamp || new Date();
    const responseTime = reading.response_time_ms || 0;

    // Start transaction
    const queries = [
      // Insert sensor log
      {
        query: 'INSERT INTO sensor_logs (sensor_id, value, response_time, timestamp) VALUES (?, ?, ?, ?)',
        params: [sensor.id, reading.value, responseTime, timestamp]
      },
      // Update sensor status
      {
        query: `
          INSERT INTO sensor_status (sensor_id, is_safe, last_value, timestamp) 
          VALUES (?, ?, ?, ?) 
          ON DUPLICATE KEY UPDATE 
          is_safe = VALUES(is_safe), 
          last_value = VALUES(last_value), 
          timestamp = VALUES(timestamp)
        `,
        params: [
          sensor.id,
          this.isSafe(reading.value, sensor.min_threshold, sensor.max_threshold),
          reading.value,
          timestamp
        ]
      }
    ];

    // Check if alert should be triggered
    if (!this.isSafe(reading.value, sensor.min_threshold, sensor.max_threshold)) {
      queries.push({
        query: `
          INSERT INTO alerts (sensor_id, alert_type, value, threshold, alert_on, is_active, timestamp)
          SELECT ?, ?, ?, ?, ?, true, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM alerts 
            WHERE sensor_id = ? AND is_active = true AND alert_off IS NULL
          )
        `,
        params: [
          sensor.id,
          reading.value > (sensor.max_threshold || Infinity) ? 1 : 0,
          reading.value,
        //   reading.value > (sensor.max_threshold || Infinity) ? sensor.max_threshold : sensor.min_threshold,
          timestamp,
          timestamp,
          sensor.id
        ]
      });
    }

    await executeTransaction(queries);
  }

  // Get sensor readings with pagination
  static async getSensorReadings(
    sensor_id?: number,
    page: number = 1,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ) {
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (sensor_id) {
      whereClause += ' AND sl.sensor_id = ?';
      params.push(sensor_id);
    }
    
    if (startDate) {
      whereClause += ' AND sl.timestamp >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += ' AND sl.timestamp <= ?';
      params.push(endDate);
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM sensor_logs sl ${whereClause}`;
    const dataQuery = `
      SELECT sl.*, s.sensor_code, s.sensor_type, s.location, s.unit
      FROM sensor_logs sl
      JOIN sensors s ON sl.sensor_id = s.id
      ${whereClause}
      ORDER BY sl.timestamp DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [countResult, readings] = await Promise.all([
      executeQuery(countQuery, params),
      executeQuery(dataQuery, [...params, limit, offset])
    ]);

    return {
      readings,
      meta: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Helper method to check if value is safe
  private static isSafe(value: number, minThreshold?: number, maxThreshold?: number): boolean {
    if (minThreshold !== null && minThreshold !== undefined && value < minThreshold) {
      return false;
    }
    if (maxThreshold !== null && maxThreshold !== undefined && value > maxThreshold) {
      return false;
    }
    return true;
  }

  // Record multiple sensor data (for bulk IoT data)
  static async recordSensorData(data: {
    room_temp?: number;
    room_hum?: number;
    rack_temp?: number;
    rack_hum?: number;
    flame_detected?: boolean;
    buzzer_state?: boolean;
    response_time_ms?: number;
  }): Promise<void> {
    const query = `
      INSERT INTO sensor_data (room_temp, room_hum, rack_temp, rack_hum, flame_detected, buzzer_state, response_time_ms, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await executeQuery(query, [
      data.room_temp,
      data.room_hum,
      data.rack_temp,
      data.rack_hum,
      data.flame_detected,
      data.buzzer_state,
      data.response_time_ms
    ]);
  }

  // Get latest sensor data
  static async getLatestSensorData(limit: number = 10) {
    const query = `
      SELECT * FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    return await executeQuery(query, [limit]);
  }
}