import { PDFDocument } from "pdf-lib"

export async function convertImagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    
    let image
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(bytes)
    } else if (file.type === "image/png") {
      image = await pdfDoc.embedPng(bytes)
    } else {
      continue // Skip unsupported formats
    }

    const { width, height } = image.scale(1)
    const page = pdfDoc.addPage([width, height])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
  }

  return await pdfDoc.save()
}
