import { Link, useLocation } from "react-router-dom"
import { Layers, Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function Header() {
  const location = useLocation()
  const isDashboard = location.pathname === "/"
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
          <div className="bg-gradient-to-tr from-red-600 to-rose-400 p-1.5 rounded-lg shadow-lg shadow-red-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PDF Custom
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            to="/history" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === '/history' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            Riwayat
          </Link>
          
          {!isDashboard && (
             <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Semua Alat
            </Link>
          )}
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Toggle Theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </nav>
      </div>
    </header>
  )
}
