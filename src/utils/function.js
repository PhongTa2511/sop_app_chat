import mammoth from "mammoth"
import XLSX from "xlsx"

export async function fetchDoc(url) {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    
    return result.value
  } catch (error) {
    console.error("Error loading document:", error)
  }
}
export async function fetchXlsxContent(url) {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })
    var html = XLSX.utils.sheet_to_html(
      workbook.Sheets[workbook.SheetNames[0]],
    )
    html = html
      .replace(
        /<table/g,
        `<table style='border: 1px solid black; border-collapse: collapse; text-align:center'`,
      )
      .replace(
        /<th/g,
        `<th style='border: 1px solid black; border-collapse: collapse; padding:8px'`,
      )
      .replace(
        /<td/g,
        `<td style='border: 1px solid black; border-collapse: collapse; padding:8px'`,
      )
    
    return html
  } catch (error) {
    console.error("Error loading spreadsheet:", error)
  }
}

export function isPreviewSupported(fileExtension) {
  const cleanedExtension = fileExtension.trim().toLowerCase()

  const supportedExtensions = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
  ]

  
  return supportedExtensions.includes(cleanedExtension)
}

export function downloadFile(file) {
  const previewUrl = `https://sop.idtp.work/api/File/GetDocumentFile?FileName=${file.LinkFile}`

  window.open(previewUrl)
}

export function downloadFileProduct(file) {
  const previewUrl = `https://sop.idtp.work/api/File/GetProductFile?FileName=${file.LinkFile}`

  window.open(previewUrl)
}
