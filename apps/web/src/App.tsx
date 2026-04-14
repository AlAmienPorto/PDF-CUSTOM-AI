import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Header } from "./components/Header"
import { DashboardPage } from "./pages/DashboardPage"
import { ToolPage } from "./pages/ToolPage"
import { HistoryPage } from "./pages/HistoryPage"
import { ThemeProvider } from "./components/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-red-500/30">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tool/:toolId" element={<ToolPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
