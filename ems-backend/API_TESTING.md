# Testing IoT Dashboard API

## Quick Test dengan curl atau Postman

### 1. Test Health Check
```bash
curl http://localhost:4999/api
```

### 2. Test Dashboard (akan gagal jika database kosong, tapi endpoint akan merespon)
```bash
curl http://localhost:4999/api/dashboard
```

### 3. Test IoT Sensor Reading (gunakan device key)
```bash
curl -X POST http://localhost:4999/api/iot/sensor-reading \
  -H "Content-Type: application/json" \
  -H "X-Device-Key: iot-device-key-2024" \
  -d '{
    "sensor_code": "TEMP001",
    "value": 25.5,
    "response_time_ms": 100
  }'
```

### 4. Test Get Sensors
```bash
curl http://localhost:4999/api/sensors
```

### 5. Test Create Sensor
```bash
curl -X POST http://localhost:4999/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_code": "TEST001",
    "sensor_type": "TEMPERATURE",
    "location": "Test Room",
    "unit": "°C",
    "min_threshold": 18.0,
    "max_threshold": 30.0
  }'
```

### 6. Test User Login (setelah database di-setup)
```bash
curl -X POST http://localhost:4999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_code": "ADMIN001",
    "password": "admin123"
  }'
```

### 7. Test IoT Comprehensive Sensor Data
```bash
curl -X POST http://localhost:4999/api/iot/sensor-data \
  -H "Content-Type: application/json" \
  -H "X-Device-Key: iot-device-key-2024" \
  -d '{
    "room_temp": 25.5,
    "room_hum": 60.2,
    "rack_temp": 30.1,
    "rack_hum": 45.0,
    "flame_detected": false,
    "gas_detected": false,
    "buzzer_state": false,
    "response_time_ms": 150
  }'
```

### 8. Test Buzzer Control
```bash
curl -X POST http://localhost:4999/api/iot/buzzer \
  -H "Content-Type: application/json" \
  -H "X-Device-Key: iot-device-key-2024" \
  -d '{
    "is_active": true
  }'
```

### 9. Test Get Active Alerts
```bash
curl http://localhost:4999/api/alerts/active
```

### 10. Test System Logs
```bash
curl -X POST http://localhost:4999/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "INFO",
    "source": "TEST",
    "message": "Test log entry from API"
  }'
```

## Expected Response Format

Semua response akan menggunakan format:

### Success Response:
```json
{
  "status": true,
  "data": { ... },
  "message": "Optional success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response:
```json
{
  "status": false,
  "error": "Error message"
}
```