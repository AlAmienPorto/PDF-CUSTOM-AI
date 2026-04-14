import { PDFDocument, degrees } from 'pdf-lib'

export type RotationDegrees = 90 | 180 | 270

/**
 * Rotate all pages in the given PDF by the specified degrees.
 */
export async function rotatePdf(file: File, rotation: RotationDegrees): Promise<Uint8Array> {
  if (file.type !== 'application/pdf') throw new Error('File must be a PDF')
  
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  
  const pages = pdfDoc.getPages()
  
  pages.forEach((page) => {
    // Add rotation to the current rotation so it's relative
    const currentRot = page.getRotation().angle
    const newRot = (currentRot + rotation) % 360
    page.setRotation(degrees(newRot))
  })

  return await pdfDoc.save()
}
