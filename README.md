# PDF CUSTOM AI 📄✨

A powerful, high-end PDF processing utility built as a modern monorepo. This application provides a seamless experience for common PDF tasks like reordering pages, adding watermarks, and compressing files, all with a premium user interface.

## 🚀 Key Features

- **PDF Reorder**: Easily drag and drop pages to reorganize your documents.
- **PDF Watermark**: Add text or image watermarks to protect your files.
- **PDF Compress**: Reduce file size without compromising quality.
- **Activity History**: Keep track of your processed files with a local SQLite-backed history.
- **Premium UI**: Crafted with Tailwind CSS and Lucide icons for a sleek, responsive experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Routing**: React Router
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Logic**: [pdf-lib](https://pdf-lib.js.org/) & [pdfjs-dist](https://mozilla.github.io/pdf.js/)

### Backend
- **Framework**: [Hono](https://hono.dev/) (Node.js runtime)
- **Database**: [SQLite](https://sqlite.org/) via [Prisma ORM](https://www.prisma.io/)
- **PDF Processing**: [Muhammara](https://github.com/galkahana/MuhammaraJS) for heavy server-side operations.

### Monorepo
- **Package Manager**: [pnpm](https://pnpm.io/) workspaces

## 📦 Installation & Setup

Follow these steps to get the project running locally:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) installed globally

### 2. Clone the Repository
```bash
git clone https://github.com/AlAmienPorto/PDF-CUSTOM-AI.git
cd PDF-CUSTOM-AI
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Database Setup
The app uses SQLite for ease of use. You need to generate the Prisma client and push the schema:
```bash
cd apps/server
pnpm prisma generate
pnpm prisma db push
cd ../..
```

### 5. Running the Application
From the root directory, run:
```bash
pnpm dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📖 Usage

1. **Dashboard**: Get an overview of your recent PDF activities.
2. **Select Tool**: Choose from Reorder, Watermark, or Compress from the sidebar or dashboard.
3. **Upload & Process**: Drop your PDF files, configure your settings, and download the result instantly.
4. **History**: Access previously processed files and logs.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [AlAmienPorto](https://github.com/AlAmienPorto)
