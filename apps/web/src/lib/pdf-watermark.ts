import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'

export async function watermarkPdf(sourceBytes: Uint8Array, text: string, opacity: number = 0.3): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(sourceBytes)
  const pages = pdfDoc.getPages()
  
  // Embed standard font to ensure it works
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  pages.forEach(page => {
    const { width, height } = page.getSize()
    const fontSize = 60
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    
    // Draw text diagonally in the center
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: opacity,
      rotate: degrees(45)
    })
  })
  
  return await pdfDoc.save()
}
