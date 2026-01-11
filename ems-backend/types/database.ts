// Database Entity Types for IoT Dashboard
export interface ActionLog {
  id: number;
  user_code?: string;
  action: string;
  timestamp: Date;
}

export interface AlertLog {
  id: number;
  alert_id: bigint;
  action: string;
  notes?: string;
  timestamp: Date;
}

export interface Alert {
  id: number;
  sensor_id: bigint;
  alert_type: string;
  value?: number;
  threshold?: number;
  alert_on: Date;
  alert_off?: Date;
  is_active?: boolean;
  timestamp: Date;
}

export interface Buzzer {
  id: number;
  is_active: boolean;
  timestamp: Date;
}

export interface Role {
  id: number;
  role_code: string;
  role_name: string;
  created_at: Date;
  is_deleted?: boolean;
}

export interface SensorData {
  id: number;
  timestamp?: Date;
  room_temp?: number;
  room_hum?: number;
  rack_temp?: number;
  rack_hum?: number;
  flame_detected?: boolean;
  buzzer_state?: boolean;
  response_time_ms?: number;
}

export interface SensorLog {
  id: number;
  sensor_id: bigint;
  value: number;
  response_time: number;
  timestamp: Date;
}

export interface SensorStatus {
  id: number;
  sensor_id: bigint;
  is_safe: boolean;
  last_value?: number;
  timestamp: Date;
}

export interface Sensor {
  id: number;
  sensor_code: string;
  sensor_type: string;
  location?: string;
  unit?: string;
  min_threshold?: number;
  max_threshold?: number;
  created_at: Date;
  updated_at?: Date;
}

export interface SystemLog {
  id: number;
  level: string;
  source: string;
  message: string;
  timestamp: Date;
}

export interface User {
  id: number;
  user_code: string;
  user_name: string;
  role_code: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
  is_deleted?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// IoT Specific Types
export interface SensorReading {
  sensor_code: string;
  value: number;
  timestamp?: Date;
  response_time_ms?: number;
}

export interface DashboardSummary {
  sensors: {
    total: number;
    active: number;
    alerts: number;
  };
  recent_readings: SensorData[];
  active_alerts: Alert[];
  system_status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}