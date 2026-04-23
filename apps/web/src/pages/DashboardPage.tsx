import { Link } from "react-router-dom"
import { TOOLS } from "../lib/constants"

export function DashboardPage() {
  return (
    <div className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
      {/* Background ambient lighting for sci-fi feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] sm:h-[500px] bg-red-500/10 dark:bg-red-500/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative text-center mb-10 sm:mb-16 md:mb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Ruang Kerja PDF Generasi Terbaru
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent leading-tight">
          Alat canggih untuk menyempurnakan dokumen Anda
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          100% gratis dan super cepat. Ubah, konversi, dan lindungi PDF Anda sepenuhnya secara native di browser.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 max-w-screen-2xl mx-auto pb-16 sm:pb-24">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link 
              key={tool.id} 
              to={`/tool/${tool.id}`}
              className={`group relative flex flex-col items-center bg-card/50 dark:bg-card/20 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 dark:border-white/5 transition-all duration-500 ease-out hover:-translate-y-2 active:scale-95 overflow-hidden ${tool.border} ${tool.glow}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 md:mb-6 bg-gradient-to-br ${tool.color} ring-1 ring-inset ring-white/10 dark:ring-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${tool.iconColor}`} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3 text-center tracking-tight text-foreground transition-colors group-hover:text-foreground">
                {tool.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground/80 text-center line-clamp-2 sm:line-clamp-3 font-medium transition-colors group-hover:text-muted-foreground hidden sm:block">
                {tool.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
