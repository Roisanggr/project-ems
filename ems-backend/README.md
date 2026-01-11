# IoT Dashboard Backend API

Backend API untuk sistem monitoring IoT menggunakan Node.js, Express, dan TypeScript tanpa ORM (raw MySQL queries).

## 🚀 Features

- **Sensor Management**: CRUD operations untuk sensor
- **Real-time Data**: Endpoint untuk menerima data dari device IoT
- **Alert System**: Sistem peringatan otomatis berdasarkan threshold
- **Dashboard**: Summary data untuk monitoring
- **User Management**: Autentikasi dan manajemen user
- **System Logs**: Logging sistem dengan berbagai level

## 📋 Prerequisites

- Node.js (v16 atau lebih tinggi)
- MySQL Database
- npm atau yarn

## 🔧 Installation

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ems_db
   PORT=3306
   JWT_SECRET=your-secret-key
   IOT_DEVICE_KEY=iot-device-key-2024
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  ```json
  {
    "user_code": "ADMIN001",
    "password": "password123"
  }
  ```

### Sensors
- `GET /api/sensors` - Get all sensors (dengan pagination)
- `POST /api/sensors` - Create new sensor
- `GET /api/sensors/:id` - Get sensor by ID
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor
- `GET /api/sensors/:id/readings` - Get sensor readings

### IoT Device Endpoints
⚠️ **Requires X-Device-Key header**

- `POST /api/iot/sensor-reading` - Record single sensor reading
  ```json
  {
    "sensor_code": "TEMP001",
    "value": 25.5,
    "response_time_ms": 100,
    "timestamp": "2024-01-11T10:00:00Z"
  }
  ```

- `POST /api/iot/sensor-data` - Record comprehensive sensor data
  ```json
  {
    "room_temp": 25.5,
    "room_hum": 60.2,
    "rack_temp": 30.1,
    "rack_hum": 45.0,
    "flame_detected": false,
    "gas_detected": false,
    "buzzer_state": false,
    "response_time_ms": 150
  }
  ```

- `GET /api/iot/sensor-data` - Get latest sensor data
- `POST /api/iot/buzzer` - Control buzzer state
- `GET /api/iot/buzzer` - Get buzzer state

### Alerts
- `GET /api/alerts` - Get all alerts (dengan filter)
- `POST /api/alerts` - Create new alert
- `GET /api/alerts/:id` - Get alert by ID
- `PUT /api/alerts/:id` - Resolve alert
- `GET /api/alerts/active` - Get active alerts
- `GET /api/alerts/stats` - Get alert statistics

### Dashboard
- `GET /api/dashboard` - Get dashboard summary

### Users
- `GET /api/user` - Get all users
- `POST /api/user` - Create new user

### System Logs
- `GET /api/logs` - Get system logs
- `POST /api/logs` - Create log entry

## 🔐 Authentication

### User Authentication
Gunakan JWT token yang diperoleh dari `/api/auth/login`:
```
Authorization: Bearer <your-jwt-token>
```

### IoT Device Authentication
Gunakan device key di header:
```
X-Device-Key: iot-device-key-2024
```

## 📈 Database Schema

Database menggunakan tabel berikut:
- `users` - User management
- `roles` - User roles
- `sensors` - Sensor configuration
- `sensor_data` - Real-time sensor data
- `sensor_logs` - Historical sensor readings
- `sensor_status` - Current sensor status
- `alerts` - Alert management
- `alert_logs` - Alert history
- `action_logs` - User action logs
- `system_logs` - System logging
- `buzzer` - Buzzer control

## 📝 Response Format

Semua API response menggunakan format standar:

### Success Response
```json
{
  "status": true,
  "data": { ... },
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "status": false,
  "error": "Error message"
}
```

## 🔧 Development

### File Structure
```
dashboard-backendd/
├── routes/           # API endpoints
│   ├── auth/         # Authentication routes
│   ├── sensors/      # Sensor management
│   ├── alerts/       # Alert management
│   ├── iot/          # IoT device endpoints
│   ├── dashboard/    # Dashboard data
│   ├── user/         # User management
│   └── logs/         # System logs
├── services/         # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Database utilities
├── app.ts           # Main application file
└── .env             # Environment variables
```

### Adding New Routes
1. Buat file di folder `routes/` sesuai dengan pola yang ada
2. Export functions: `get`, `post`, `put`, `del` sesuai HTTP method
3. Gunakan services untuk database operations
4. Follow response format yang sudah ada

### Best Practices
- Selalu validate input data
- Gunakan transactions untuk operasi kompleks
- Log error dan action penting
- Implement proper error handling
- Use TypeScript types untuk type safety

## 🧪 Testing

### Manual Testing dengan Curl

#### Login
```bash
curl -X POST http://localhost:4999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_code":"ADMIN001","password":"password123"}'
```

#### IoT Data Recording
```bash
curl -X POST http://localhost:4999/api/iot/sensor-reading \
  -H "Content-Type: application/json" \
  -H "X-Device-Key: iot-device-key-2024" \
  -d '{"sensor_code":"TEMP001","value":25.5,"response_time_ms":100}'
```

#### Dashboard Data
```bash
curl -X GET http://localhost:4999/api/dashboard
```

## 📊 Monitoring

Server menyediakan endpoint monitoring:
- Database connection status
- Active alerts count
- System health metrics

## 🚨 Error Handling

API menggunakan proper HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error