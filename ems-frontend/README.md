# EMS Frontend Development

Environment Monitoring System Frontend dengan Vite Development Server.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
# atau
npm run serve
```

Server akan berjalan di: `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Structure

```
ems-frontend/
├── index.html              # Landing page
├── pages/
│   ├── dashboard/          # Dashboard utama
│   ├── activities/         # Halaman aktivitas
│   ├── report_page/        # Halaman laporan
│   └── support_page/       # Halaman support
├── js/
│   └── script.js          # Script utama
├── images/                 # Asset gambar
├── vite.config.js         # Konfigurasi Vite
└── package.json           # Dependencies

```

## 🔧 Features

- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-refresh saat file berubah  
- 🌐 Proxy API ke backend (port 4999)
- 📦 Optimized production builds
- 🎯 Multiple entry points

## 🔗 API Integration

Semua request ke `/api/*` akan di-proxy ke backend server di `http://localhost:4999`

## 📝 Development Workflow

1. Start backend server: `npm start` (di folder ems-backend)
2. Start frontend server: `npm run dev` (di folder ems-frontend)
3. Open browser: `http://localhost:3000`
4. Edit files dan lihat perubahan real-time!

## 🚀 Production Deployment

1. Build: `npm run build`
2. Deploy folder `dist/` ke web server
3. Configure web server untuk serve static files dan proxy `/api` ke backend