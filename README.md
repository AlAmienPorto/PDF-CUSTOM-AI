# 📄 PDF CUSTOM AI

<div align="center">

> **Selamat datang di PDF CUSTOM AI** — Solusi modern untuk semua kebutuhan manipulasi PDF Anda, dibuat dengan teknologi web terkini dan desain antarmuka yang elegan.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white&style=flat-square)](https://hono.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white&style=flat-square)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm&logoColor=white&style=flat-square)](https://pnpm.io/)

</div>

---

## 🌟 Tentang Proyek

**PDF CUSTOM AI** lahir dari kebutuhan nyata: mengelola file PDF seharusnya tidak ribet. Proyek ini hadir sebagai aplikasi web lokal yang ringan namun powerful, menggabungkan UI premium berbasis React dengan backend API yang cepat menggunakan Hono dan Prisma. Semua proses berjalan di perangkat Anda sendiri — tidak ada data yang dikirim ke server manapun.

Dibangun sebagai monorepo dengan `pnpm workspaces`, proyek ini juga menjadi bukti nyata penerapan arsitektur modern full-stack yang terstruktur dan *scalable*.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| 📑 **PDF Reorder** | Susun ulang halaman dokumen secara intuitif dengan antarmuka drag-and-drop |
| 🔏 **PDF Watermark** | Lindungi dokumen Anda dengan watermark teks maupun gambar |
| 🗜️ **PDF Compress** | Perkecil ukuran file secara signifikan tanpa mengorbankan kualitas |
| ✂️ **PDF Split** | Pisahkan halaman tertentu menjadi file baru dengan mudah |
| 🔗 **PDF Merge** | Gabungkan beberapa file PDF menjadi satu dokumen |
| 🖼️ **JPG ↔ PDF** | Konversi gambar ke PDF atau sebaliknya dalam hitungan detik |
| 🗓️ **Riwayat Aktivitas** | Pantau semua riwayat pemrosesan file secara lokal |

---

## 🛠️ Tumpukan Teknologi

### 🎨 Frontend
- **[React 18](https://reactjs.org/)** — Library UI yang reaktif dan komponen-based
- **[Vite 5](https://vitejs.dev/)** — Build tool yang super cepat untuk pengalaman pengembangan terbaik
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling yang efisien dan konsisten
- **[React Router](https://reactrouter.com/)** — Navigasi antar halaman yang mulus
- **[Lucide React](https://lucide.dev/)** — Koleksi ikon SVG yang bersih dan modern
- **[pdf-lib](https://pdf-lib.js.org/)** & **[PDF.js](https://mozilla.github.io/pdf.js/)** — Manipulasi PDF langsung di browser

### ⚙️ Backend
- **[Hono](https://hono.dev/)** — Framework web ultra-ringan dan cepat untuk Node.js
- **[Prisma ORM](https://www.prisma.io/)** — Akses database yang type-safe dan modern
- **[SQLite](https://sqlite.org/)** — Database lokal tanpa konfigurasi tambahan
- **[Muhammara](https://github.com/galkahana/MuhammaraJS)** — Pemrosesan PDF sisi server yang handal

### 🗂️ Infrastruktur
- **[pnpm Workspaces](https://pnpm.io/)** — Manajemen monorepo yang efisien

---

## 🚀 Cara Memulai

### Prasyarat

Pastikan perangkat Anda sudah terinstal:
- **[Node.js](https://nodejs.org/)** versi 18 atau lebih tinggi
- **[pnpm](https://pnpm.io/installation)** (manajer paket)

### Langkah Instalasi

**1. Clone repositori ini**
```bash
git clone https://github.com/AlAmienPorto/PDF-CUSTOM-AI.git
cd PDF-CUSTOM-AI
```

**2. Instal semua dependensi**
```bash
pnpm install
```

**3. Siapkan database**
```bash
cd apps/server
pnpm prisma generate
pnpm prisma db push
cd ../..
```

**4. Jalankan aplikasi**
```bash
pnpm dev
```

Aplikasi kini berjalan di:
- 🌐 **Frontend** → http://localhost:5173
- 🔌 **Backend API** → http://localhost:3000

---

## 📖 Panduan Penggunaan

1. **Buka Dashboard** — Lihat ringkasan aktivitas terbaru Anda.
2. **Pilih Alat** — Navigasi ke fitur yang Anda butuhkan dari sidebar.
3. **Unggah File** — Seret & lepas file PDF ke area yang tersedia.
4. **Proses & Unduh** — Atur konfigurasi, klik proses, dan unduh hasilnya seketika.
5. **Cek Riwayat** — Akses kembali semua aktivitas dari halaman Riwayat.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE) — bebas digunakan, dipelajari, dan dikembangkan.

---

<div align="center">

Dibuat dengan ❤️ oleh **[AlAmienPorto](https://github.com/AlAmienPorto)**

*"Kode yang baik adalah seni. Proyek ini adalah buktinya."*

</div>
