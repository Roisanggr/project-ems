# 🌱 Environment Monitoring System (EMS) for local only

![EMS Banner](https://img.shields.io/badge/EMS-Environment%20Monitoring%20System-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Sistem monitoring lingkungan berbasis IoT untuk memantau kondisi tanaman secara real-time.

## 🚀 Fitur Utama

- 📊 **Real-time Dashboard** - Monitoring sensor data secara langsung
- 🌡️ **Multi Sensor Support** - suhu, kelembaban, flame
- ⚡ **TypeScript Full Stack** - Backend dan Frontend menggunakan TypeScript
- 🔔 **Smart Alerts** - Notifikasi otomatis untuk kondisi abnormal
- 📱 **Responsive Design** - Akses dari desktop maupun mobile
- 🛡️ **Type Safety** - Full type checking untuk development yang aman

## 🏗️ Arsitektur

```
project-ems/
├── ems-backend/          # Node.js + TypeScript Backend
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── types/           # Type definitions
│   └── utils/           # Database utilities
├── ems-frontend/        # Vite + TypeScript Frontend
│   ├── pages/           # HTML pages
│   ├── js/             # TypeScript modules
│   ├── types/          # Frontend type definitions
│   └── assets/         # Static assets
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Multiple DB support (MySQL, PostgreSQL, etc.)
- **API**: RESTful API with type-safe endpoints

### Frontend
- **Build Tool**: Vite
- **Language**: TypeScript
- **Charts**: Chart.js
- **Styling**: Bootstrap 5
- **Module System**: ES6 Modules

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Roisanggr/project-ems.git
cd project-ems
```

### 2. Setup Backend
```bash
cd ems-backend
npm install
npm start
```
Backend akan berjalan di: `http://localhost:4999`

### 3. Setup Frontend
```bash
cd ems-frontend
npm install
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

## 📱 Development

### Commands Backend
```bash
npm start          # Start production server
npm run dev        # Start development server
npm run build      # Build TypeScript
npm run type-check # Check TypeScript types
```

### Commands Frontend
```bash
npm run dev        # Start development server (like ng serve)
npm run build      # Build untuk production
npm run preview    # Preview production build
npm run type-check # Check TypeScript types
```

### 🔧 Development Workflow
1. **Backend**: `npm start` (port 4999)
2. **Frontend**: `npm run dev` (port 5173)
3. **API Proxy**: Frontend otomatis proxy `/api/*` ke backend
4. **Hot Reload**: Perubahan code langsung terlihat

## 📊 Dashboard Features

### Sensor Monitoring
- 🌡️ **pH Level** - Monitoring keasaman tanah
- 💧 **Soil Moisture** - Kelembaban tanah real-time
- 🚰 **Water Pump** - Status pompa penyiraman
- 🌾 **Feeder Pump** - Status pompa pupuk

### Visualisasi Data
- 📈 **Line Charts** - Trend data historis
- 🍩 **Donut Charts** - Distribusi data
- 📊 **Real-time Updates** - Data ter-update otomatis
- 🎯 **Interactive Charts** - Chart.js dengan type safety

## 🔔 Alert System

- ⚠️ **Threshold Monitoring** - Alert otomatis untuk nilai abnormal
- 📧 **Email Notifications** - Notifikasi via email
- 🔊 **Sound Alerts** - Alert suara untuk kondisi kritis
- 📱 **Mobile Responsive** - Alert dapat diakses via mobile

## 🧪 Testing & Quality

- ✅ **TypeScript** - Type safety di seluruh codebase
- 🛡️ **Type Checking** - `npm run type-check` untuk validasi
- 🔍 **Error Handling** - Comprehensive error handling
- 📝 **Code Documentation** - Self-documenting dengan TypeScript

## 🚀 Production Deployment

### Backend Deployment
```bash
cd ems-backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd ems-frontend
npm run build
# Deploy folder dist/ ke web server
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk details.

## 👥 Team

- **Developer**: Rois Afif Anggoro
- **GitHub**: [@Roisanggr](https://github.com/Roisanggr)

## 🎯 Roadmap

- [ ] WebSocket untuk real-time data streaming
- [ ] Mobile app (React Native/Flutter)
- [ ] Machine Learning untuk predictive analytics
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit testing coverage

---

🌱 **Environment Monitoring System** - Monitoring lingkungan yang cerdas untuk masa depan yang hijau!
