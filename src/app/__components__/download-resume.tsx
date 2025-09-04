import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PdfTemplate } from "./utils/pdf/templates/Templates";

export function DownloadResumePDF({
  cvdata,
  filename = "resume.pdf",
}: {
  cvdata: any;
  filename?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    if (!cvdata || busy) return;
    setBusy(true);
    try {
      const pdf = new PdfTemplate();
      // Your generator returns a blob URL
      const url: string = await pdf.resume(cvdata);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Let the download start before revoking the URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button size="sm" onClick={handleDownload} disabled={!cvdata || busy}>
      {busy ? "Preparing…" : "Download PDF"}
    </Button>
  );
}
