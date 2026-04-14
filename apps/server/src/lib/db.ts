import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'logs.json')

export interface ActivityLog {
  id: string
  toolId: string
  fileName: string
  fileSize: number
  status: string
  createdAt: string
}

async function ensureDb() {
  const dir = path.dirname(DB_PATH)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
  
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([]))
  }
}

export const db = {
  async getLogs(): Promise<ActivityLog[]> {
    await ensureDb()
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  },

  async addLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    await ensureDb()
    const logs = await this.getLogs()
    const newLog: ActivityLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }
    logs.push(newLog)
    await fs.writeFile(DB_PATH, JSON.stringify(logs, null, 2))
    return newLog
  }
}
