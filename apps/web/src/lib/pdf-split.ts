import { PDFDocument } from 'pdf-lib'

/**
 * Parses a page range string (e.g. "1-3, 5") into an array of zero-indexed page numbers.
 */
function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>()
  
  if (!rangeStr.trim()) {
    // If empty string, return all pages
    for (let i = 0; i < maxPages; i++) {
        pages.add(i)
    }
    return Array.from(pages)
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
  
  return Array.from(pages).sort((a, b) => a - b)
}

/**
 * Split a PDF based on the specified page ranges.
 */
export async function splitPdf(file: File, ranges: string): Promise<Uint8Array> {
  if (file.type !== 'application/pdf') throw new Error('File must be a PDF')
  
  const arrayBuffer = await file.arrayBuffer()
  const sourcePdf = await PDFDocument.load(arrayBuffer)
  
  const totalPages = sourcePdf.getPageCount()
  const pagesToExtract = parsePageRanges(ranges, totalPages)
  
  if (pagesToExtract.length === 0) {
    throw new Error('No valid pages found in range')
  }

  const resultPdf = await PDFDocument.create()
  const copiedPages = await resultPdf.copyPages(sourcePdf, pagesToExtract)
  
  copiedPages.forEach((page) => {
    resultPdf.addPage(page)
  })

  return await resultPdf.save()
}
