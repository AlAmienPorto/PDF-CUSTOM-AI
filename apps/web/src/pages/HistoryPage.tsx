import { useState, useEffect } from "react"
import { History, FileText, CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react"

interface Activity {
  id: string
  toolId: string
  fileName: string
  fileSize: number
  status: string
  createdAt: string
}

export function HistoryPage() {
  const [logs, setLogs] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('http://localhost:3000/api/logs')
        const data = await response.json()
        if (Array.isArray(data)) {
          setLogs(data)
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Riwayat Aktivitas
          </h1>
          <p className="text-muted-foreground text-lg">
            Pantau operasi PDF terbaru dan log audit Anda.
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-md border border-border/50 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-xl">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Operasi</p>
            <p className="text-2xl font-black">{logs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-3xl rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-24 flex flex-col items-center justify-center">
            <Clock className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Mengambil riwayat...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-24 flex flex-col items-center justify-center text-center">
            <div className="bg-muted/30 p-6 rounded-full mb-6">
              <History className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">Belum ada aktivitas</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Mulai gunakan alat PDF kami dan aktivitas Anda akan otomatis muncul di sini untuk keperluan audit.
            </p>
            <a href="/" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform">
              Kembali ke Dashboard
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider">Nama File</th>
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider">Alat</th>
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider">Ukuran</th>
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider">Waktu</th>
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-sm font-bold text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="font-semibold truncate max-w-[200px]" title={log.fileName}>
                          {log.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                        {log.toolId.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm font-medium">
                      {formatSize(log.fileSize)}
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">
                      {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-8 py-6">
                      {log.status === 'SUCCESS' ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Berhasil
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500 text-sm font-bold">
                          <XCircle className="w-4 h-4" /> Gagal
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Log audit disimpan secara lokal di database server Anda.
      </p>
    </div>
  )
}
