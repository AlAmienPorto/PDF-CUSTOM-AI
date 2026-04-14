# PDF CUSTOM AI 📄✨

Utilitas pemrosesan PDF canggih dan modern yang dibangun dengan struktur monorepo. Aplikasi ini memberikan pengalaman mulus untuk tugas-tugas PDF umum seperti menyusun ulang halaman, menambahkan watermark, dan kompresi file, semuanya dengan antarmuka pengguna (UI) yang premium.

## 🚀 Fitur Utama

- **PDF Reorder**: Susun ulang halaman dokumen Anda dengan mudah menggunakan fitur drag-and-drop.
- **PDF Watermark**: Tambahkan watermark teks atau gambar untuk melindungi dokumen Anda.
- **PDF Compress**: Perkecil ukuran file tanpa mengurangi kualitas secara signifikan.
- **Riwayat Aktivitas**: Pantau semua file yang telah diproses melalui riwayat lokal yang didukung oleh SQLite.
- **UI Premium**: Didesain menggunakan Tailwind CSS dan Lucide Icons untuk pengalaman yang elegan dan responsif.

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: [React](https://reactjs.org/) dengan [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Routing**: React Router
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Logika PDF**: [pdf-lib](https://pdf-lib.js.org/) & [pdfjs-dist](https://mozilla.github.io/pdf.js/)

### Backend
- **Framework**: [Hono](https://hono.dev/) (Node.js runtime)
- **Database**: [SQLite](https://sqlite.org/) melalui [Prisma ORM](https://www.prisma.io/)
- **Pemrosesan PDF**: [Muhammara](https://github.com/galkahana/MuhammaraJS) untuk operasi server-side yang berat.

### Monorepo
- **Manajer Paket**: [pnpm](https://pnpm.io/) workspaces

## 📦 Instalasi & Persiapan

Ikuti langkah-langkah berikut untuk menjalankan proyek di perangkat lokal Anda:

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih tinggi)
- [pnpm](https://pnpm.io/installation) sudah terinstal secara global

### 2. Clone Repositori
```bash
git clone https://github.com/AlAmienPorto/PDF-CUSTOM-AI.git
cd PDF-CUSTOM-AI
```

### 3. Instal Dependensi
```bash
pnpm install
```

### 4. Persiapan Database
Aplikasi ini menggunakan SQLite agar mudah digunakan. Anda perlu melakukan generate Prisma client dan menyesuaikan skema:
```bash
cd apps/server
pnpm prisma generate
pnpm prisma db push
cd ../..
```

### 5. Menjalankan Aplikasi
Dari direktori root, jalankan perintah:
```bash
pnpm dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📖 Cara Penggunaan

1. **Dashboard**: Lihat ringkasan aktivitas PDF terbaru Anda.
2. **Pilih Alat**: Pilih menu Reorder, Watermark, atau Compress dari sidebar atau dashboard.
3. **Unggah & Proses**: Masukkan file PDF Anda, atur konfigurasi yang diinginkan, dan unduh hasilnya secara instan.
4. **Riwayat**: Akses kembali log dan file yang pernah diproses sebelumnya.

## 📄 Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---
Dibuat dengan ❤️ oleh [AlAmienPorto](https://github.com/AlAmienPorto)
