export async function previewFile(file) {
  if (!this.isPreviewSupported(file.MineFile)) {
    alert("File này không hỗ trợ xem trước.");
    return;
  }
  this.isLoading = true;
  this.nameFile = file.NameFile.toUpperCase();
  this.docContent = "";
  const fileExtension = file.MineFile.toLowerCase();
  this.fileMine = fileExtension;
  const previewUrl = `https://crm.icpc1hn.work/GSPDTPAPI/File/GetDocumentFile?FileName=${file.LinkFile}`;
  console.log(previewUrl);

  // Check for supported file types
  if (fileExtension === ".pdf") {
    this.fileUrl = previewUrl;
    this.isShowFile = true;
    // this.docContent = `<iframe :src="${this.fileUrl}" width="100%" height="600px"></iframe>`;
  } else if (fileExtension === ".docx") {
    this.fileUrl = previewUrl;
    this.isShowFile = true;
    await this.fetchDoc(this.fileUrl);
  } else if (fileExtension === ".xlsx") {
    this.fileUrl = previewUrl;
    this.isShowFile = true;
    await this.fetchXlsxContent(this.fileUrl);
  } else if ([".png", ".jpg", ".jpeg"].includes(fileExtension)) {
    this.isShowFile = true;
    this.docContent = `<img lazy src="${previewUrl}" alt="Image preview" width="100%" />`;
  }
  this.isLoading = false;
}
export async function fetchDoc(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    this.docContent = result.value;
  } catch (error) {
    console.error("Error loading document:", error);
  }
}
export async function fetchXlsxContent(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    var html = XLSX.utils.sheet_to_html(
      workbook.Sheets[workbook.SheetNames[0]]
    );
    html = html
      .replace(
        /<table/g,
        `<table style='border: 1px solid black; border-collapse: collapse; text-align:center'`
      )
      .replace(
        /<th/g,
        `<th style='border: 1px solid black; border-collapse: collapse; padding:8px'`
      )
      .replace(
        /<td/g,
        `<td style='border: 1px solid black; border-collapse: collapse; padding:8px'`
      );
    console.log(html);

    this.docContent = html;
  } catch (error) {
    console.error("Error loading spreadsheet:", error);
  }
}

export function isPreviewSupported(fileExtension) {
  const cleanedExtension = fileExtension.trim().toLowerCase();
  const supportedExtensions = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
  ];
  return supportedExtensions.includes(cleanedExtension);
}

export function downloadFile(file) {
  const previewUrl = `https://crm.icpc1hn.work/GSPDTPAPI/File/GetDocumentFile?FileName=${file.LinkFile}`;
  window.open(previewUrl);
}
