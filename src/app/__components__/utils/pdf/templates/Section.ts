import { Pdf } from "./Pdf";
import PDFDocument from "pdfkit";

export class PdfSection {
  static debug = false;
  public internal: {
    doc: PDFKit.PDFDocument;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };

  private get _() {
    return this.internal;
  }

  private set(state: Partial<Pdf["internal"]>) {
    this.internal = {
      ...this.internal,
      ...state,
    };
  }

  constructor(
    doc: typeof PDFDocument,
    dims: { sx: number; sy: number; ex: number; ey: number },
  ) {
    this.internal = {
      doc,
      minX: dims.sx,
      minY: dims.sy,
      maxX: dims.ex,
      maxY: dims.ey,
    };
  }

  /**
   *
   * @param bgColor: hex color with hashtag, e.g. #ffaa22
   * @param width: decimal determining relative width, e.g. 0.5 (50%)
   * @param height: decimal determining relative height, e.g. 0.33 (33%)
   * @param x: decimal determining relative x, e.g. 0.5 (50%)
   * @param y: decimal determining relative y, e.g. 0.33 (33%)
   */
  section({
    bgColor,
    width,
    height,
    x,
    y,
  }: {
    bgColor?: string;
    height?: number;
    width?: number;
    x?: number;
    y?: number;
  }) {
    const params = {
      bgColor: bgColor,
      height: height ?? 1,
      width: width ?? 1,
      x: x ?? 0,
      y: y ?? 0,
    };

    const { x: px, y: py, width: pw, height: ph } = params;
    const { maxX, maxY, minX, minY } = this._;

    // --- Individual bounds ---
    if (px < 0 || px > 1) {
      throw new Error(`x (${px}) must be between 0 and 1`);
    }
    if (py < 0 || py > 1) {
      throw new Error(`y (${py}) must be between 0 and 1`);
    }
    if (pw <= 0 || pw > 1) {
      throw new Error(`width (${pw}) must be greater than 0 and at most 1`);
    }
    if (ph <= 0 || ph > 1) {
      throw new Error(`height (${ph}) must be greater than 0 and at most 1`);
    }

    // --- Combined bounds ---
    if (px + pw > 1) {
      throw new Error(`x (${px}) + width (${pw}) exceeds the max bound (1)`);
    }
    if (py + ph > 1) {
      throw new Error(`y (${py}) + height (${ph}) exceeds the max bound (1)`);
    }

    const sectionWidth = maxX - minX;
    const sectionHeight = maxY - minY;

    const dims = {
      sx: minX + sectionWidth * px,
      sy: minY + sectionHeight * py,
      ex: minX + sectionWidth * (px + pw),
      ey: minY + sectionHeight * (py + ph),
    };

    // --- Drawing ---
    if (params.bgColor || PdfSection.debug) {
      this.internal.doc
        .save()
        .moveTo(dims.sx, dims.sy)
        .lineTo(dims.sx, dims.ey)
        .lineTo(dims.ex, dims.ey)
        .lineTo(dims.ex, dims.sy)
        .fill(params.bgColor ?? "#ff2a2f");
    }

    return new PdfSection(this.internal.doc, dims);
  }

  /**
   * Adds text within the bounds of the section.
   */
  text(
    text: string,
    options: {
      align?: PDFKit.Mixins.TextOptions["align"];
      fontSize?: number;
      font?: string;
      color?: string;
    } = {},
  ) {
    const { minX, minY, maxX, maxY, doc } = this.internal;

    const width = maxX - minX;
    const height = maxY - minY;

    // Optional styling
    if (options.font) doc.font(options.font);
    if (options.fontSize) doc.fontSize(options.fontSize);
    if (options.color) doc.fillColor(options.color);

    doc.text(text, minX, minY, {
      width,
      height,
      align: options.align ?? "left",
    });
  }

  /**
   * Adds an image within the bounds of the section.
   */
  image(uri: PDFKit.Mixins.ImageSrc) {
    const { minX, minY, maxX, maxY, doc } = this.internal;

    const width = maxX - minX;
    const height = maxY - minY;
    const widthHeightDiff = Math.abs(width - height);
    const useWidth = width < height;
    const useHeight = height < width;
    const sx = useHeight ? minX + widthHeightDiff / 2 : minX;
    const sy = useWidth ? minY + widthHeightDiff / 2 : minY;

    doc.image(uri, sx, sy, {
      width: useWidth ? width : undefined,
      height: useHeight ? height : undefined,
    });
  }
}
