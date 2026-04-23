import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Layers, Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function Header() {
  const location = useLocation()
  const isDashboard = location.pathname === "/"
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-transform hover:scale-105 active:scale-95">
          <div className="bg-gradient-to-tr from-red-600 to-rose-400 p-1 sm:p-1.5 rounded-lg shadow-lg shadow-red-500/20">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PDF Custom
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-4 md:gap-6">
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

        {/* Mobile Nav Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Toggle Theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link 
              to="/history" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/history' ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
            >
              Riwayat
            </Link>
            {!isDashboard && (
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
              >
                Semua Alat
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
