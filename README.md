# 🎯 AyoCare - Sistem Laporan Keselamatan Sekolah

Aplikasi web untuk melaporkan dan mengelola kondisi tidak aman di lingkungan sekolah dengan sistem eskalasi bertingkat.

## ✨ Fitur Utama

### 📋 Pelaporan
- Formulir laporan yang mudah digunakan
- Upload foto dengan kamera langsung atau galeri
- Kategorisasi otomatis berdasarkan lokasi
- 4 tingkat prioritas: Rendah, Sedang, Tinggi, Darurat

### 🏢 Sistem Eskalasi 4 Tingkat

#### **Level 1: User/Guru** 👤
- **Kemampuan**: Perbaikan sederhana, koordinasi dengan siswa, pembersihan ringan
- **Kategori**: Ruang Kelas, Perpustakaan, Ruang Guru
- **Auto Escalation**: 8 jam

#### **Level 2: Wali Kelas** 👥
- **Kemampuan**: Koordinasi antar kelas, manajemen fasilitas umum, komunikasi orangtua
- **Kategori**: Koridor, Toilet, Kantin
- **Auto Escalation**: 4 jam

#### **Level 3: General Affairs** 🏢
- **Kemampuan**: Perbaikan infrastruktur, maintenance, procurement, vendor management
- **Kategori**: Semua Workshop, Halaman, Parkiran
- **Auto Escalation**: 2 jam

#### **Level 4: Top Management** 📊
- **Kemampuan**: Keputusan strategis, budget approval, policy changes, emergency response
- **Eskalasi**: Untuk kasus emergency atau kritis

### ⏰ Eskalasi Otomatis
- **Emergency**: 30 menit → Top Management
- **High**: 2 jam → Top Management
- **Medium**: 8 jam → maksimal GA
- **Low**: 24 jam → maksimal GA

### 🎛️ Panel Admin
- Dashboard dengan statistik lengkap
- Filter berdasarkan handler level dan status
- Eskalasi manual dengan tracking history
- Respons admin dan update status
- Matriks eskalasi visual

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone https://github.com/nug31/ayocare.git
cd ayocare
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev
```

4. **Akses aplikasi**
```
http://localhost:5173/
```

### 🔐 Login Credentials

#### Admin
- **Email**: `admin@ayocare.com`
- **Password**: `admin123`

#### Guru/User
- **Email**: `ahmad.guru@smk.edu`
- **Password**: `guru123`

## 📁 Struktur Project

```
src/
├── components/
│   ├── AdminRoute.tsx
│   ├── EscalationMatrix.tsx     # Komponen matriks eskalasi
│   ├── Layout.tsx
│   └── ...
├── context/
│   ├── AuthContext.tsx
│   └── ReportContext.tsx        # State management laporan
├── hooks/
│   └── useEscalation.ts         # Hook logika eskalasi
├── pages/
│   ├── AdminPanel.tsx           # Panel admin dengan eskalasi
│   ├── EscalationPage.tsx       # Halaman matriks eskalasi
│   ├── ReportForm.tsx           # Form laporan + handler info
│   └── ...
└── types/
    └── escalation.ts            # Type definitions eskalasi
```

## 🎨 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Build**: Vite
- **State**: Context API + useReducer

## 📖 Cara Menggunakan

### 1. **Membuat Laporan**
- Login sebagai guru/user
- Pilih "Buat Laporan"
- Isi formulir (judul, kategori, lokasi, deskripsi)
- Upload foto (opsional)
- Sistem otomatis menentukan handler berdasarkan kategori

### 2. **Mengelola Laporan (Admin)**
- Login sebagai admin
- Akses Admin Panel
- Filter laporan berdasarkan status/handler
- Eskalasi manual ke level yang sesuai
- Tambah respons dan update status
- Lihat riwayat eskalasi

### 3. **Melihat Matriks Eskalasi**
- Klik tombol "Matriks" di Admin Panel
- Atau akses `/escalation`
- Lihat tingkatan handler, mapping kategori, dan aturan eskalasi

## 🔄 Flow Sistem Eskalasi

```
1. User membuat laporan
   ↓
2. Sistem menentukan handler berdasarkan kategori
   ↓
3. Laporan masuk ke queue handler level awal
   ↓
4. Jika tidak ditangani dalam batas waktu:
   → Auto escalation ke level berikutnya
   ↓
5. Admin dapat eskalasi manual kapan saja
   ↓
6. Semua eskalasi tercatat dalam history
```

## 🏗️ Build & Deploy

### Build Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Joko Setyo Nugroho**
- GitHub: [@nug31](https://github.com/nug31)
- Email: joko@example.com

---

⭐ **Star this repo if you find it useful!**
