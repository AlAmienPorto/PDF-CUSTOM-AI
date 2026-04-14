import { Link } from "react-router-dom"
import { TOOLS } from "../lib/constants"

export function DashboardPage() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Background ambient lighting for sci-fi feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-red-500/10 dark:bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative text-center mb-20 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Ruang Kerja PDF Generasi Terbaru
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
          Alat canggih untuk menyempurnakan dokumen Anda
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          100% gratis dan super cepat. Ubah, konversi, dan lindungi PDF Anda sepenuhnya secara native di browser.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 max-w-screen-2xl mx-auto pb-24">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link 
              key={tool.id} 
              to={`/tool/${tool.id}`}
              className={`group relative flex flex-col items-center bg-card/50 dark:bg-card/20 backdrop-blur-sm p-8 rounded-3xl border border-white/10 dark:border-white/5 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden ${tool.border} ${tool.glow}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`p-4 rounded-2xl mb-6 bg-gradient-to-br ${tool.color} ring-1 ring-inset ring-white/10 dark:ring-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-8 h-8 ${tool.iconColor}`} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-xl font-bold mb-3 text-center tracking-tight text-foreground transition-colors group-hover:text-foreground">
                {tool.name}
              </h2>
              <p className="text-sm text-muted-foreground/80 text-center line-clamp-3 font-medium transition-colors group-hover:text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
