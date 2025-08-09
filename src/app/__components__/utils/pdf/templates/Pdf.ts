import PDFDocument from "pdfkit";
import { PdfSection } from "./Section";

export class Pdf extends PdfSection {
  private chunks: Uint8Array[];
  /**
   *
   * @param doc: A blank! PDFDocum
   */
  constructor() {
    const doc = new PDFDocument();

    super(doc, {
      sx: 0,
      sy: 0,
      ex: doc.page.width,
      ey: doc.page.height,
    });

    this.chunks = [];
    this.internal.doc.on("data", (chunk) => this.chunks.push(chunk));
  }

  /**
   *
   * @returns the blob url of the pdf
   */
  async end() {
    const endPromise = new Promise<string>((resolve, reject) => {
      this.internal.doc.on("end", () => {
        try {
          const blob = new Blob(this.chunks, {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(blob);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      });
    });
    this.internal.doc.end();
    return endPromise;
  }
}
