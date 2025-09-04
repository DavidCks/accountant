import { FC, useState } from "react";
import { useEffect } from "react";
import "./utils/pdf/registerFonts";
import { PdfTemplate } from "./utils/pdf/templates/Templates";
import { CVDataType } from "./utils/pdf/templates/CVData";

const ResumeTemplate: FC<{ cvdata: CVDataType }> = ({ cvdata }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const create = async () => {
      const pdfTemplate = new PdfTemplate();
      const url = await pdfTemplate.resume(cvdata);
      setPdfUrl(url);
    };
    create();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [cvdata]);

  return (
    <div>
      {pdfUrl && (
        <iframe
          className="rounded-md"
          key={pdfUrl}
          src={pdfUrl}
          width="100%"
          height="600"
        />
      )}
    </div>
  );
};

export default ResumeTemplate;
