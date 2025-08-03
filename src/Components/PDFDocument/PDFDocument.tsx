import React, { ComponentProps, useMemo } from 'react';
import { pdfjs, Document } from 'react-pdf';
import { getFrontendUrlStaticPath } from 'Utils/functions';

const pdfJsOptions = {
  standardFontDataUrl: getFrontendUrlStaticPath('/static/media/standard_fonts/'),
};
pdfjs.GlobalWorkerOptions.workerSrc = getFrontendUrlStaticPath(
  '/static/js/pdf.worker.min.js',
);

export type PDFDocumentProps = ComponentProps<typeof Document>;

function PDFDocument(props: PDFDocumentProps) {
  const options = useMemo(() => ({ ...props.options, ...pdfJsOptions }), [props.options]);

  return <Document {...props} options={options} />;
}

export default PDFDocument;
