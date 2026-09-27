declare const require: any;

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const pdfModule = eval("require")('pdf-parse');
    
    // Check if PDFParse class is available (pdf-parse v2)
    if (pdfModule && pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text || '';
    }

    // Check if default function is available (pdf-parse v1)
    if (typeof pdfModule === 'function') {
      const result = await pdfModule(buffer);
      return result.text || '';
    }

    if (pdfModule && typeof pdfModule.default === 'function') {
      const result = await pdfModule.default(buffer);
      return result.text || '';
    }

    return '';
  } catch (error: any) {
    console.error('Error parsing PDF buffer:', error.message);
    return '';
  }
}
