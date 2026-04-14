import { useEffect, useState } from "react"
import { RefreshCw, GripVertical } from "lucide-react"

interface PdfThumbnailViewerProps {
  bytes: Uint8Array
  onOrderChange: (newOrder: number[]) => void
}

export function PdfThumbnailViewer({ bytes, onOrderChange }: PdfThumbnailViewerProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [order, setOrder] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPdf() {
      setIsLoading(true)
      try {
        const pdfjsLib = await import("pdfjs-dist")
        // Use a confirmed stable CDN for v3.11.174
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

        const loadingTask = pdfjsLib.getDocument({ data: bytes })
        const pdf = await loadingTask.promise
        
        const numPages = pdf.numPages
        const newThumbnails: string[] = []
        const intialOrder: number[] = []

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.5 }) // Render small for speed
          
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          canvas.height = viewport.height
          canvas.width = viewport.width

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise
            newThumbnails.push(canvas.toDataURL("image/jpeg", 0.7))
          }
          intialOrder.push(i - 1)
        }

        if (isMounted) {
          setThumbnails(newThumbnails)
          setOrder(intialOrder)
          onOrderChange(intialOrder)
        }
      } catch (e) {
        console.error("Failed to render PDF thumbnails:", e)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPdf()

    return () => { isMounted = false }
  }, [bytes])

  const handleDragEnter = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return
    const newOrder = [...order]
    const draggedItem = newOrder[draggedIdx]
    newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, draggedItem)
    
    setOrder(newOrder)
    setDraggedIdx(targetIdx)
    onOrderChange(newOrder)
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-card/10 rounded-xl border border-white/10">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Extracting Pages for Preview...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-card/10 rounded-[2rem] border border-white/10 shadow-inner min-h-[500px]">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="font-bold text-lg">Visual Page Reordering</h3>
        <span className="text-sm text-primary font-medium">{thumbnails.length} Pages</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {order.map((originalIdx, currentIdx) => (
          <div
            key={`page-${originalIdx}`}
            draggable
            onDragStart={() => setDraggedIdx(currentIdx)}
            onDragEnter={() => handleDragEnter(currentIdx)}
            onDragEnd={() => setDraggedIdx(null)}
            onDragOver={(e) => e.preventDefault()}
            className={`group relative bg-background rounded-xl p-2 flex flex-col items-center cursor-move transition-all ${
              draggedIdx === currentIdx ? "opacity-50 ring-2 ring-primary scale-95" : "border border-white/10 hover:border-white/30 hover:shadow-lg"
            }`}
          >
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded shadow backdrop-blur-sm z-10 hidden group-hover:flex items-center">
              <GripVertical className="w-3 h-3 mr-1" /> Drag
            </div>
            <img 
              src={thumbnails[originalIdx]} 
              alt={`Page ${originalIdx + 1}`} 
              className="w-full h-auto object-contain rounded-md border border-border pointer-events-none"
            />
            <div className="mt-2 text-xs font-bold bg-muted w-full text-center py-1 rounded text-muted-foreground">
              Page {originalIdx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
