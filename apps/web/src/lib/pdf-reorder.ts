import { PDFDocument } from 'pdf-lib'

/**
 * Re-create a PDF document based on a new page order.
 * @param sourceBytes The original PDF bytes to reorder
 * @param pageOrder Array specifying the new 0-indexed page sequence (e.g. [2, 0, 1])
 */
export async function reorderPdfPages(sourceBytes: Uint8Array, pageOrder: number[]): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(sourceBytes)
  const resultPdf = await PDFDocument.create()
  
  // Validate order to prevent out-of-boundary access
  const totalOriginalPages = sourcePdf.getPageCount()
  const validOrder = pageOrder.filter(idx => idx >= 0 && idx < totalOriginalPages)
  
  if (validOrder.length === 0) {
    throw new Error("Invalid page order specified.")
  }

  // Copy pages out of order natively
  const copiedPages = await resultPdf.copyPages(sourcePdf, validOrder)
  
  copiedPages.forEach(page => {
    resultPdf.addPage(page)
  })

  return await resultPdf.save()
}
