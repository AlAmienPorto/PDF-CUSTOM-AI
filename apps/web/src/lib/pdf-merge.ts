import { PDFDocument } from 'pdf-lib'

/**
 * Menggabungkan beberapa file PDF menjadi satu file ArrayBuffer.
 * Diproses sepenuhnya di sisi klien (browser) untuk privasi dan kecepatan maksimal.
 * 
 * @param files Array of File objects (harus bertipe application/pdf)
 * @returns ArrayBuffer dari PDF yang sudah digabungkan
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  // Buat dokumen PDF kosong baru
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    if (file.type !== 'application/pdf') {
      console.warn(`File ${file.name} dilewati karena bukan PDF.`)
      continue
    }

    try {
      // Ubah File menjadi ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      
      // Muat buffer ke objek PDF-lib
      const pdfToMerge = await PDFDocument.load(arrayBuffer)
      
      // Ambil indeks semua halaman dari PDF yang sedang diproses
      const copiedPages = await mergedPdf.copyPages(
        pdfToMerge, 
        pdfToMerge.getPageIndices()
      )

      // Masukkan semua halaman yang dicopy ke dokumen utama
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    } catch (error) {
      console.error(`Gagal memproses file ${file.name}:`, error)
      throw new Error(`Gagal menggabungkan: ${file.name}`)
    }
  }

  // Simpan hasil gabungan ke format byte array
  return await mergedPdf.save()
}

/**
 * Fungsi pembantu untuk memicu download file di browser.
 * 
 * @param bytes Data Uint8Array dari pdf
 * @param filename Nama file yang akan diunduh
 */
export function downloadPdf(bytes: Uint8Array, filename: string) {
  // Use bytes.buffer or cast to properly satisfy TS BlobPart typings
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  
  document.body.appendChild(link)
  link.click()
  
  // Bersihkan memory
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
