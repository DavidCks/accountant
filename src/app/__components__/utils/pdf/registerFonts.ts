// the fs here is not node fs but the provided virtual one
import fs from "fs";
// the content file is returned as is (webpack is configured to load *.afm files as asset/source)
import Courier from "pdfkit/js/data/Courier.afm";
import CourierBold from "pdfkit/js/data/Courier-Bold.afm";
import Helvetica from "pdfkit/js/data/Helvetica.afm";
import HelveticaBold from "pdfkit/js/data/Helvetica-Bold.afm";
import { WebpackRequire, WebpackRequireContext } from "./webpackTypes";

function registerAFMFonts(ctx: WebpackRequireContext) {
  console.log("[pdfkit] [font register]", ctx);
  ctx.keys().forEach((key) => {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      // afm files must be stored on data path
      fs.writeFileSync(`data/${match[0]}`, ctx(key));
    }
  });
}

// register AFM fonts distributed with pdfkit
// is good practice to register only required fonts to avoid the bundle size increase too much
registerAFMFonts(
  (require as WebpackRequire).context(
    "pdfkit/js/data",
    false,
    /Helvetica.*\.afm$/,
  ),
);

// register files imported directly
fs.writeFileSync("data/Courier.afm", Courier);
fs.writeFileSync("data/Courier-Bold.afm", CourierBold);
fs.writeFileSync("data/Helvetica.afm", Helvetica);
fs.writeFileSync("data/Helvetica-Bold-Bold.afm", HelveticaBold);
