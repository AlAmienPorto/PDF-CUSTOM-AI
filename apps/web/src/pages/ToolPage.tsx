import { useState, useCallback, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronRight, UploadCloud, FileText, X, Settings2, RefreshCw, Eye, Download, EyeOff, CheckCircle2, ArrowRight } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { TOOLS } from "../lib/constants"
import { PdfThumbnailViewer } from "../components/PdfThumbnailViewer"

import { mergePdfs } from "../lib/pdf-merge"
import { splitPdf } from "../lib/pdf-split"
import { removePdfPages } from "../lib/pdf-remove"
import { rotatePdf } from "../lib/pdf-rotate"
import { reorderPdfPages } from "../lib/pdf-reorder"
import { watermarkPdf } from "../lib/pdf-watermark"
import { convertImagesToPdf } from "../lib/jpg-to-pdf"
import { compressPdf } from "../lib/pdf-compress"

export function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitRange, setSplitRange] = useState("")
  const [removeRange, setRemoveRange] = useState("")
  const [rotateAngle, setRotateAngle] = useState<"90" | "180" | "270">("90")
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null)
  const [reorderedPages, setReorderedPages] = useState<number[]>([])
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [pdfPassword, setPdfPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium")
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const tool = TOOLS.find(t => t.id === toolId)
  
  // Cleanup preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      ...(tool?.id === 'jpg-to-pdf' ? {'image/*': ['.jpg', '.jpeg', '.png']} : {})
    }
  })

  // Drag and drop for reordering files
  const handleDragEnter = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return
    setFiles((prev) => {
      const newFiles = [...prev]
      const draggedItem = newFiles[draggedIdx]
      newFiles.splice(draggedIdx, 1)
      newFiles.splice(targetIdx, 0, draggedItem)
      return newFiles
    })
    setDraggedIdx(targetIdx)
  }

  const removeFile = (indexToRemove: number) => {
    setFiles((prev: File[]) => prev.filter((_, idx: number) => idx !== indexToRemove))
  }

  const handleExecute = async () => {
    if (!tool || files.length === 0) return
    
    setIsProcessing(true)
    try {
      const pdfjsLib = await import("pdfjs-dist")
      // Use a confirmed stable CDN for v3.11.174
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
      
      let finalBytes: Uint8Array | null = null

      if (tool.id === "merge") {
        finalBytes = await mergePdfs(files)
      } else if (tool.id === "split") {
        if (files.length > 1) {
          alert("For split, please select only 1 file at a time.")
          setIsProcessing(false)
          return
        }
        finalBytes = await splitPdf(files[0], splitRange)
      } else if (tool.id === "remove") {
        if (files.length > 1) {
           alert("For remove pages, please select only 1 file at a time.")
           setIsProcessing(false)
           return
        }
        if (!removeRange) {
           alert("Please specify pages to remove.")
           setIsProcessing(false)
           return
        }
        finalBytes = await removePdfPages(files[0], removeRange)
      } else if (tool.id === "rotate") {
        if (files.length > 1) {
            alert("For preview capability, rotate supports processing 1 file at a time right now.")
            setIsProcessing(false)
            return
        }
        finalBytes = await rotatePdf(files[0], Number(rotateAngle) as 90|180|270)
      } else if (tool.id === "watermark") {
        if (files.length > 1) {
            alert("Please process 1 file at a time for Watermarking.")
            setIsProcessing(false)
            return
        }
        if (!watermarkText.trim()) {
            alert("Please enter watermark text.")
            setIsProcessing(false)
            return
        }
        const fileBytes = new Uint8Array(await files[0].arrayBuffer())
        finalBytes = await watermarkPdf(fileBytes, watermarkText)
      } else if (tool.id === "pdf-to-jpg") {
        const { convertPdfToImages } = await import("../lib/pdf-to-jpg")
        const fileBytes = new Uint8Array(await files[0].arrayBuffer())
        await convertPdfToImages(fileBytes, files[0].name)
        setIsSuccess(true)
        setIsProcessing(false)
        return 
      } else if (tool.id === "jpg-to-pdf") {
        finalBytes = await convertImagesToPdf(files)
      } else if (tool.id === "compress") {
        const fileBytes = new Uint8Array(await files[0].arrayBuffer())
        setOriginalSize(files[0].size)
        finalBytes = await compressPdf(fileBytes, compressionLevel)
        setCompressedSize(finalBytes.length)
      } else if (tool.id === "protect" || tool.id === "unlock") {
        if (!pdfPassword) {
            alert("Please provide a password.")
            setIsProcessing(false)
            return
        }
        
        // Use FormData for server-side tools
        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("password", pdfPassword)
        
        const response = await fetch(`http://localhost:3000/api/${tool.id}`, {
          method: "POST",
          body: formData
        })
        
        if (!response.ok) throw new Error(`Server processing failed: ${response.statusText}`)
        
        const blob = await response.blob()
        finalBytes = new Uint8Array(await blob.arrayBuffer())
      } else {
        alert("Tool not implemented yet!")
      }

      if (finalBytes) {
        setPreviewBytes(finalBytes)
        if (previewUrl) URL.revokeObjectURL(previewUrl) // clean previous
        const blob = new Blob([finalBytes as any], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)

        // Audit the successful operation
        fetch('http://localhost:3000/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            toolId: tool.id, 
            fileName: files[0].name, 
            fileSize: files[0].size,
            status: 'SUCCESS' 
          })
        }).catch(err => console.warn('Audit failed (offline):', err))
      }

    } catch (error: any) {
      console.error(error)
      alert(error?.message || "An error occurred during processing.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
     if (!previewBytes) return
     
     setIsProcessing(true)
     try {
       let bytesToDownload = previewBytes
       
       // If the user modified the order in the thumbnail viewer, recompile!
       if (tool?.id === 'merge' && reorderedPages.length > 0) {
          bytesToDownload = await reorderPdfPages(previewBytes, reorderedPages)
       }

       const url = URL.createObjectURL(new Blob([bytesToDownload as any], { type: 'application/pdf' }))
       const link = document.createElement('a')
       link.href = url
       link.download = `pdf-${toolId}-result.pdf`
       document.body.appendChild(link)
       link.click()
       document.body.removeChild(link)
       URL.revokeObjectURL(url)
       setIsSuccess(true)
     } catch (e) {
       console.error(e)
       alert("Failed generating final download.")
     } finally {
       setIsProcessing(false)
     }
  }

  const resetPreview = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setPreviewBytes(null)
      setReorderedPages([])
      setIsSuccess(false)
  }

  if (!tool) {
    return <div className="p-12 text-center text-xl font-bold">Alat tidak ditemukan</div>
  }
  
  const Icon = tool.icon

  if (isSuccess && tool) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-500 text-center relative flex-1 flex flex-col justify-center">
        {/* Breadcrumb Navbar */}
        <nav className="flex items-center text-xs sm:text-sm font-medium text-muted-foreground mb-6 sm:mb-8 relative sm:absolute sm:top-8 sm:left-4">
          <Link to="/" className="hover:text-foreground transition-colors">
            Semua Alat
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground">{tool.name}</span>
        </nav>

        <div className="bg-card/40 backdrop-blur-3xl rounded-2xl sm:rounded-[3rem] border border-border/50 p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden relative max-w-4xl mx-auto w-full">
          {/* Glow */}
          <div className={`absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br ${tool.color} blur-[80px] opacity-20`} />
          
          <div className="inline-flex p-4 sm:p-6 rounded-full bg-emerald-500/10 mb-6 sm:mb-8 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16 text-emerald-500" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Berhasil Download!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
            {tool.id === 'compress' 
              ? `You saved ${((originalSize - compressedSize) / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - compressedSize / originalSize) * 100)}%) of storage space!`
              : "File PDF Anda telah berhasil diproses dan diunduh secara otomatis."}
          </p>

          {tool.id === 'compress' && (
            <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 animate-in slide-in-from-bottom-2 duration-700">
               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Before</span>
                  <span className="text-2xl font-bold line-through opacity-50">{(originalSize / 1024 / 1024).toFixed(2)} MB</span>
               </div>
               <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary/10">
                  <ArrowRight className="w-6 h-6 text-primary" />
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">After</span>
                  <span className="text-3xl font-black text-emerald-500">{(compressedSize / 1024 / 1024).toFixed(2)} MB</span>
               </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-16">
             <button 
               onClick={handleDownload}
               className="text-sm font-semibold text-primary hover:underline flex items-center gap-2 transition-all hover:scale-105"
             >
               <Download className="w-4 h-4" />
               jika gagal ulangi dengan mengeklik tombol ini
             </button>
             
             <button 
               onClick={() => { resetPreview(); setFiles([]); }}
                className="px-6 sm:px-10 py-4 sm:py-5 bg-foreground text-background rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 text-sm sm:text-base"
             >
               Process File Lain
               <ArrowRight className="w-5 h-5" />
             </button>
          </div>

          <div className="border-t border-border/50 pt-6 sm:pt-12 text-left">
             <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Butuh alat lain?</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {TOOLS.filter(t => t.id !== tool.id).slice(0, 4).map(t => (
                  <Link 
                    key={t.id} 
                    to={`/tool/${t.id}`} 
                    onClick={() => { resetPreview(); setFiles([]); }} 
                    className="group p-4 bg-muted/20 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex items-center gap-3"
                  >
                     <div className={`p-2 rounded-xl bg-gradient-to-br ${t.color.replace('/20', '').replace('/5', '')}`}>
                       <t.icon className="w-4 h-4 text-white" />
                     </div>
                     <span className="font-bold text-sm truncate">{t.name}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      {...getRootProps()} 
      className={`flex flex-col min-h-[calc(100vh-4rem)] relative overflow-hidden transition-colors duration-500 outline-none ${isDragActive ? "bg-accent/10" : "bg-background"}`}
    >
      <input {...getInputProps()} />
      
      {/* Global Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-12 border-4 border-dashed border-primary">
           <UploadCloud className="w-24 h-24 mb-6 animate-bounce" />
           <h2 className="text-4xl font-extrabold tracking-tight">Lepaskan file di mana saja!</h2>
           <p className="opacity-80 mt-2 text-xl font-medium">Lepaskan mouse untuk menambahkan file ke {tool.name}</p>
        </div>
      )}

      {/* Dynamic ambient background based on tool color */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r ${tool.color} blur-[120px] rounded-[100%] opacity-20 pointer-events-none`} />

      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col flex-1 z-10 relative">
        {/* Breadcrumb Navbar */}
        <nav className="flex items-center text-xs sm:text-sm font-medium text-muted-foreground mb-4 sm:mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Semua Alat
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground">{tool.name}</span>
        </nav>

        {files.length === 0 ? (
          <>
            {/* Header Hero Area */}
            <div className="flex flex-col items-center justify-center mb-6 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-gradient-to-br ${tool.color} ring-1 ring-inset ring-white/10 shadow-xl inline-flex`}>
                <Icon className={`w-8 h-8 sm:w-12 sm:h-12 ${tool.iconColor}`} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight text-center bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                {tool.name}
              </h1>
              <p className="text-muted-foreground text-center max-w-xl text-sm sm:text-lg px-2">
                {tool.description}
              </p>
            </div>
            
            {/* Futuristic Dropzone */}
            <div className="flex-1 flex flex-col items-center px-2 sm:px-4 md:px-0 animate-in fade-in zoom-in-95 duration-500 delay-150">
              <div 
                onClick={open}
                className={`group relative w-full max-w-4xl h-56 sm:h-72 md:h-80 bg-card/10 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed ${isDragActive ? 'border-primary/50' : 'border-white/20 hover:border-white/40'} flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${tool.glow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`relative p-4 sm:p-6 rounded-full mb-4 sm:mb-6 bg-card border border-white/5 shadow-2xl transition-transform duration-500 ${isDragActive ? 'scale-125' : 'group-hover:scale-110 group-hover:-translate-y-2'}`}>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "currentColor" }} />
                  <UploadCloud className={`w-8 h-8 sm:w-12 sm:h-12 ${tool.iconColor}`} strokeWidth={1.5} />
                </div>
                
                <p className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 text-foreground tracking-tight">
                  Pilih file PDF
                </p>
                <p className="text-xs sm:text-base text-muted-foreground font-medium">atau seret PDF ke mana saja di layar</p>
                
                <button 
                  type="button"
                  className="mt-4 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-foreground text-background text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-black/20 dark:shadow-white/5"
                >
                  Cari File
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Workspace / Files Preview */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 bg-card/40 backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] border border-border/50 min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl">
              
              {previewUrl && previewBytes ? (
                // PDF Native Embed Viewer OR Visual Reorder Output
                <div className="w-full h-full flex flex-col flex-1 animate-in fade-in zoom-in-95 duration-500">
                   <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-4">
                     <h3 className="font-bold flex items-center gap-2">
                       <Eye className="w-5 h-5 text-primary" />
                       Hasil Pratinjau Langsung
                     </h3>
                     <button onClick={resetPreview} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors">
                        Sembunyikan Pratinjau & Edit File
                     </button>
                   </div>
                   
                   {/* Interactive thumbnail viewer active for 'merge' and 'reorder' */}
                   {tool.id === 'merge' || tool.id === 'reorder' ? (
                     <div className="relative w-full flex-1 min-h-[500px]">
                       <PdfThumbnailViewer 
                          bytes={previewBytes} 
                          onOrderChange={(newOrder) => setReorderedPages(newOrder)} 
                       />
                     </div>
                   ) : (
                     <iframe 
                        src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`} 
                        className="w-full flex-1 rounded-xl border border-white/10 bg-background shadow-inner min-h-[500px]"
                        title="PDF Preview"
                     />
                   )}
                </div>
              ) : (
                // File Grid Viewer
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 content-start flex-1">
                  {files.map((file, idx) => (
                    <div 
                      key={`${file.name}-${idx}`} 
                      draggable 
                      onDragStart={() => setDraggedIdx(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragEnd={() => setDraggedIdx(null)}
                      onDragOver={(e) => e.preventDefault()}
                      className={`group relative bg-background/80 rounded-2xl border ${draggedIdx === idx ? 'border-primary/50 opacity-50 shadow-inner' : 'border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1'} p-4 flex flex-col items-center transition-all cursor-move`}
                    >
                      <button 
                        onClick={() => removeFile(idx)}
                        className="absolute -top-3 -right-3 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="w-full aspect-[3/4] bg-muted/30 rounded-xl mb-3 flex items-center justify-center border border-white/10 relative overflow-hidden pointer-events-none">
                         <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 bg-red-500/20 text-red-500 rounded-md">PDF</span>
                         <FileText className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium w-full truncate text-center" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}

                  {/* Add more button */}
                  {(tool.id !== 'split' && tool.id !== 'remove' && tool.id !== 'rotate' || files.length === 0) && (
                    <div 
                      onClick={open}
                      className="rounded-2xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center p-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors min-h-[140px] sm:min-h-[200px]"
                    >
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Tambah lagi</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Configuration */}
            <div className="w-full lg:w-[320px] xl:w-[350px] flex flex-col gap-3 sm:gap-4">
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/50 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Pengaturan</h3>
                </div>
                
                <div className="space-y-4 text-sm text-foreground">
                  {tool.id === "split" ? (
                    <div className="space-y-2">
                       <label className="font-medium">Halaman yang Diekstrak (misal: 1-3, 5)</label>
                       <input 
                         type="text" 
                         value={splitRange}
                         onChange={e => setSplitRange(e.target.value)}
                         placeholder="Biarkan kosong untuk semua halaman" 
                         className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                       />
                       <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                         Gunakan tanda hubung (-) untuk rentang halaman (misal: 1-5). Gunakan koma untuk pemisah. Anda bisa membiarkannya kosong untuk mengekstrak seluruh halaman secara terpisah.
                       </p>
                    </div>
                  ) : tool.id === "remove" ? (
                    <div className="space-y-2">
                       <label className="font-medium">Halaman yang Dihapus (misal: 1-3, 5)</label>
                       <input 
                         type="text" 
                         value={removeRange}
                         onChange={e => setRemoveRange(e.target.value)}
                         placeholder="misal: 1, 3, 5-7" 
                         className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                       />
                       <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                         Gunakan tanda hubung (-) untuk rentang atau koma (,) untuk memisahkan halaman spesifik yang ingin dihapus.
                       </p>
                    </div>
                  ) : tool.id === "rotate" ? (
                    <div className="space-y-2">
                       <label className="font-medium">Sudut Rotasi</label>
                       <div className="flex flex-col gap-2 mt-2">
                         <select 
                           value={rotateAngle} 
                           onChange={(e) => setRotateAngle(e.target.value as "90"|"180"|"270")}
                           className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                         >
                           <option value="90">Kanan 90°</option>
                           <option value="180">Terbalik 180°</option>
                           <option value="270">Kiri 90° (270°)</option>
                         </select>
                       </div>
                    </div>
                  ) : tool.id === 'watermark' ? (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">Teks Watermark</label>
                      <input 
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. DRAFT or CONFIDENTIAL"
                        className="flex h-12 w-full rounded-xl border border-input bg-background/50 backdrop-blur-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-inner"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Stamps diagonally across all pages.</p>
                    </div>
                  ) : tool.id === 'compress' ? (
                    <div className="space-y-4">
                      <label className="font-medium">Tingkat Kompresi</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["low", "medium", "high"].map((level) => (
                          <button
                            key={level}
                            onClick={() => setCompressionLevel(level as any)}
                            className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                              compressionLevel === level 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-background hover:bg-muted"
                            }`}
                          >
                            {level.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      
                      {files.length > 0 && (
                        <div className="p-4 rounded-xl bg-muted/30 border border-white/5 space-y-3">
                           <div className="flex justify-between text-xs">
                             <span className="text-muted-foreground">Ukuran Asli:</span>
                             <span className="font-mono">{(files[0].size / 1024 / 1024).toFixed(2)} MB</span>
                           </div>
                           <div className="flex justify-between text-xs font-bold text-emerald-500">
                             <span>Estimasi Penghematan:</span>
                             <span>
                               {compressionLevel === 'low' ? '~5%' : compressionLevel === 'medium' ? '~15%' : '~30%'}
                             </span>
                           </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">Kompresi tinggi mungkin sedikit mengurangi kualitas gambar.</p>
                    </div>
                  ) : tool.id === 'protect' || tool.id === 'unlock' ? (
                    <div className="space-y-4">
                      <label className="font-medium">{tool.id === 'protect' ? "Password Baru" : "Password PDF"}</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={pdfPassword}
                          onChange={(e) => setPdfPassword(e.target.value)}
                          placeholder="Masukkan password..."
                          className="w-full bg-background border rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tool.id === 'protect' 
                          ? "Password ini akan diperlukan untuk membuka PDF."
                          : "Masukkan password saat ini untuk mendekripsi PDF."}
                      </p>
                    </div>
                  ) : tool.id === 'jpg-to-pdf' ? (
                    <div className="space-y-2">
                       <p className="text-sm font-medium">Gambar akan digabungkan menjadi satu PDF.</p>
                       <p className="text-xs text-muted-foreground">Seret untuk mengatur urutan gambar di sebelah kiri sebelum konversi.</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Konfigurasi alat akan muncul di sini sesuai dengan fitur yang dipilih ({tool.name}).
                    </p>
                  )}
                </div>
              </div>

              <button 
                onClick={previewUrl ? handleDownload : handleExecute}
                disabled={files.length === 0 || isProcessing}
                className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl transition-all text-white text-sm sm:text-base drop-shadow-md border border-white/10 bg-gradient-to-r ${tool.color.replace(/\/\d+/, '')} from-50% ${
                  files.length === 0 || isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95 shadow-primary/20"
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : previewUrl ? (
                  <>
                    <Download className="w-5 h-5 fill-current" />
                    Unduh Hasil
                  </>
                ) : (
                  <>
                    {tool.id === 'pdf-to-jpg' ? <Download className="w-5 h-5 fill-current" /> : <Eye className="w-5 h-5 fill-current" />}
                    {tool.id === 'pdf-to-jpg' ? "Konversi & Unduh" : `Pratinjau ${tool.name.replace(" PDF", "")}`}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
