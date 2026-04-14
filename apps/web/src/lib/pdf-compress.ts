import { PDFDocument } from "pdf-lib"

export async function compressPdf(bytes: Uint8Array, level: "low" | "medium" | "high" = "medium"): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(bytes)
  
  if (level === "high" || level === "medium") {
    // Strip metadata for medium/high
    pdfDoc.setTitle("")
    pdfDoc.setAuthor("")
    pdfDoc.setSubject("")
    pdfDoc.setKeywords([])
    pdfDoc.setProducer("")
    pdfDoc.setCreator("")
  }

  if (level === "high") {
    // High compression: copy to a new document to force full restructuring
    const newDoc = await PDFDocument.create()
    const pages = await newDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())
    pages.forEach(p => newDoc.addPage(p))
    return await newDoc.save({ useObjectStreams: true })
  }

  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false
  })
}
