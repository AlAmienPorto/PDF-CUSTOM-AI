import * as pdfjsLib from "pdfjs-dist"

export async function convertPdfToImages(bytes: Uint8Array, filenamePrefix: string): Promise<void> {
  // Use a confirmed stable CDN for v3.11.174
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

  const loadingTask = pdfjsLib.getDocument({ data: bytes })
  const pdf = await loadingTask.promise
  const numPages = pdf.numPages

  // For each page, render to canvas and download sequentially
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 2.0 }) // 2.0 scale for high quality JPG
    
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.height = viewport.height
    canvas.width = viewport.width

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      
      // Trigger download for each image
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${filenamePrefix.replace('.pdf', '')}_page_${i}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Small pause to allow browser to process downloads without crashing
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }
}
