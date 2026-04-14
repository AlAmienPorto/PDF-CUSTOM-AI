import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db, ActivityLog } from './lib/db.js'
import muhammara from 'muhammara'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}))

app.get('/', (c) => {
  return c.json({ message: 'PDF Custom Backend is running with JSON DB' })
})

// Fetch logs
app.get('/api/logs', async (c) => {
  try {
    const logs = await db.getLogs()
    // Return last 20 logs, newest first
    const sortedLogs = logs.sort((a: ActivityLog, b: ActivityLog) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 20)
    
    return c.json(sortedLogs)
  } catch (error) {
    return c.json({ error: 'Failed to fetch logs' }, 500)
  }
})

// Audit tool usage
app.post('/api/audit', async (c) => {
  try {
    const body = await c.req.json()
    const log = await db.addLog({
      toolId: body.toolId,
      fileName: body.fileName,
      fileSize: body.fileSize,
      status: body.status || 'SUCCESS'
    })
    return c.json(log)
  } catch (error) {
    console.error('Audit Error:', error)
    return c.json({ error: 'Failed to log activity' }, 500)
  }
})

// Placeholder for tools that require server processing
app.post('/api/protect', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File
  const password = body['password'] as string

  if (!file || !password) return c.json({ error: 'Missing file or password' }, 400)

  const tempIn = path.join(os.tmpdir(), `in-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`)
  const tempOut = path.join(os.tmpdir(), `out-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`)

  try {
    const bytes = await file.arrayBuffer()
    fs.writeFileSync(tempIn, Buffer.from(bytes))
    
    console.log(`Protecting ${file.name} with password...`)
    
    const pdfWriter = muhammara.createWriter(tempOut, {
      userPassword: password,
      ownerPassword: password // Setting owner same as user for simplicity
    })
    
    pdfWriter.appendPDFPagesFromPDF(tempIn)
    pdfWriter.end()
    
    const result = fs.readFileSync(tempOut)
    
    // Clean up
    fs.unlinkSync(tempIn)
    fs.unlinkSync(tempOut)

    return c.body(result, 200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="protected-${file.name}"`
    })
  } catch (error: any) {
    console.error('Protect Error:', error)
    if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn)
    if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut)
    return c.json({ error: 'Failed to protect PDF: ' + error.message }, 500)
  }
})

app.post('/api/unlock', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File
  const password = body['password'] as string

  if (!file || !password) return c.json({ error: 'Missing file or password' }, 400)

  const tempIn = path.join(os.tmpdir(), `in-un-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`)
  const tempOut = path.join(os.tmpdir(), `out-un-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`)

  try {
    const bytes = await file.arrayBuffer()
    fs.writeFileSync(tempIn, Buffer.from(bytes))
    
    console.log(`Unlocking ${file.name}...`)
    
    const pdfWriter = muhammara.createWriter(tempOut)
    // appendPDFPagesFromPDF can take a password in the options
    pdfWriter.appendPDFPagesFromPDF(tempIn, { password: password })
    pdfWriter.end()
    
    const result = fs.readFileSync(tempOut)
    
    // Clean up
    fs.unlinkSync(tempIn)
    fs.unlinkSync(tempOut)

    return c.body(result, 200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="unlocked-${file.name}"`
    })
  } catch (error: any) {
    console.error('Unlock Error:', error)
    if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn)
    if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut)
    return c.json({ error: 'Failed to unlock PDF: Invalid password or corrupted file.' }, 500)
  }
})

app.post('/api/compress', async (c) => {
  // Compress is currently handled client-side but we keep the endpoint for future heavy processing
  return c.json({ message: 'Compression handled by client power!' })
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
