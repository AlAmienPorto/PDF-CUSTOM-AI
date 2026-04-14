import { 
  FilePlus, 
  Split, 
  FileMinus,
  RefreshCw,
  Image as ImageIcon,
  FileImage,
  Minimize2,
  Brush,
  Lock,
  Unlock,
  MoveUpRight,
  LucideIcon
} from "lucide-react"

export type ToolConfig = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  iconColor: string
  glow: string
  border: string
}

export const TOOLS: ToolConfig[] = [
  {
    id: "merge",
    name: "Gabungkan PDF",
    description: "Gabungkan beberapa file PDF dan gambar menjadi satu dokumen.",
    icon: FilePlus,
    color: "from-red-500/20 to-rose-500/5",
    iconColor: "text-red-500 dark:text-red-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
    border: "group-hover:border-red-500/50",
  },
  {
    id: "split",
    name: "Pisahkan PDF",
    description: "Ekstrak halaman dari PDF Anda atau simpan setiap halaman sebagai PDF terpisah.",
    icon: Split,
    color: "from-orange-500/20 to-amber-500/5",
    iconColor: "text-orange-500 dark:text-orange-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]",
    border: "group-hover:border-orange-500/50",
  },
  {
    id: "remove",
    name: "Hapus Halaman",
    description: "Hapus halaman dari dokumen PDF dengan cepat dan mudah.",
    icon: FileMinus,
    color: "from-amber-500/20 to-yellow-500/5",
    iconColor: "text-amber-500 dark:text-amber-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    border: "group-hover:border-amber-500/50",
  },
  {
    id: "reorder",
    name: "Susun Ulang Halaman",
    description: "Atur ulang urutan halaman dalam dokumen PDF Anda secara visual.",
    icon: RefreshCw,
    color: "from-emerald-500/20 to-green-500/5",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
    border: "group-hover:border-emerald-500/50",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF ke JPG",
    description: "Ubah setiap halaman PDF menjadi format JPG atau ekstrak semua gambar.",
    icon: ImageIcon,
    color: "from-cyan-500/20 to-sky-500/5",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
    border: "group-hover:border-cyan-500/50",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG ke PDF",
    description: "Ubah gambar JPG ke PDF dalam hitungan detik. Sesuaikan orientasi dengan mudah.",
    icon: FileImage,
    color: "from-indigo-500/20 to-blue-500/5",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]",
    border: "group-hover:border-indigo-500/50",
  },
  {
    id: "compress",
    name: "Kompres PDF",
    description: "Kurangi ukuran file sambil mengoptimalkan kualitas PDF secara maksimal.",
    icon: Minimize2,
    color: "from-green-500/20 to-emerald-500/5",
    iconColor: "text-green-500 dark:text-green-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]",
    border: "group-hover:border-green-500/50",
  },
  {
    id: "watermark",
    name: "Watermark",
    description: "Tambahkan cap gambar atau teks di atas PDF Anda dalam sekejap.",
    icon: Brush,
    color: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-500 dark:text-violet-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
    border: "group-hover:border-violet-500/50",
  },
  {
    id: "rotate",
    name: "Rotasi PDF",
    description: "Putar halaman PDF Anda sesuai dengan kebutuhan.",
    icon: MoveUpRight,
    color: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-500 dark:text-blue-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
    border: "group-hover:border-blue-500/50",
  },
  {
    id: "protect",
    name: "Proteksi PDF",
    description: "Enkripsi PDF Anda dengan password untuk mencegah akses yang tidak sah.",
    icon: Lock,
    color: "from-slate-500/20 to-gray-500/5",
    iconColor: "text-slate-500 dark:text-slate-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(100,116,139,0.3)]",
    border: "group-hover:border-slate-500/50",
  },
  {
    id: "unlock",
    name: "Buka Proteksi PDF",
    description: "Hapus enkripsi password PDF untuk memberikan kebebasan akses bagi Anda.",
    icon: Unlock,
    color: "from-rose-500/20 to-pink-500/5",
    iconColor: "text-rose-500 dark:text-rose-400",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
    border: "group-hover:border-rose-500/50",
  }
]
