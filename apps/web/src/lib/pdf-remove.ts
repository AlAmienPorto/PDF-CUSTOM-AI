import { PDFDocument } from 'pdf-lib'

/**
 * Parses a string of pages or ranges to array of zero-indexed page numbers.
 * Example input: "1, 3, 5-7"
 */
function parsePagesToRemove(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>()
  
  if (!rangeStr.trim()) {
    return [] // Don't remove anything if empty
  }

  const parts = rangeStr.split(',').map(s => s.trim())
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let i = start; i <= end; i++) {
          if (i <= maxPages) pages.add(i - 1)
        }
      }
    } else {
      const page = Number(part)
      if (!isNaN(page) && page > 0 && page <= maxPages) {
        pages.add(page - 1)
      }
    }
  }
  
  // Sort descending so that index shifting doesn't mess up removal
  return Array.from(pages).sort((a, b) => b - a)
}

/**
 * Remove specific pages from the provided PDF file.
 */
export async function removePdfPages(file: File, pagesInput: string): Promise<Uint8Array> {
  if (file.type !== 'application/pdf') throw new Error('File must be a PDF')
  
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  
  const totalPages = pdfDoc.getPageCount()
  const pagesToRemove = parsePagesToRemove(pagesInput, totalPages)
  
  if (pagesToRemove.length === 0) {
    throw new Error('No valid pages selected to remove. Please specify using numbers like "1,3" or "2-4".')
  }

  // Remove pages. Since we sorted descending, the indexes remain safe to use without offset drift.
  for (const pageIndex of pagesToRemove) {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      pdfDoc.removePage(pageIndex)
    }
  }
  
  if (pdfDoc.getPageCount() === 0) {
    throw new Error('You removed all pages from the document!')
  }

  return await pdfDoc.save()
}
