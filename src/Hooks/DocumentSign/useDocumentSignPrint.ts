import { useCallback, useState, useEffect } from 'react';
import { SignedUrlResponse } from 'Interfaces/Common';
import { Document, DocumentDownloadPayload } from 'Interfaces/Document';
import { useDownloadFileByUrl } from 'Hooks/Requisite';
import { usePrint } from 'Hooks/Common';
import { useDocumentDownloadUrlGet } from 'Hooks/Document';

interface PrintDocument {
  (payload: DocumentDownloadPayload): void;
}

export default (documentItem: Document) => {
  const [getDocumentDownloadUrl] = useDocumentDownloadUrlGet();
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [downloadFile, isDownloading] = useDownloadFileByUrl();
  const printFile = usePrint();

  useEffect(() => {
    setIsDocumentUpdated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentItem]);

  const handleGetUrl = useCallback(
    async (payload: DocumentDownloadPayload): Promise<string> => {
      if (isDocumentUpdated) {
        const signedUrlResponse = (await getDocumentDownloadUrl(
          payload,
        )) as SignedUrlResponse;

        let file = await downloadFile(signedUrlResponse.result);
        file = file.slice(0, file.size, 'application/pdf');

        const url = URL.createObjectURL(file);

        setPdfUrl(URL.createObjectURL(file));
        setIsDocumentUpdated(false);

        return url;
      }

      return pdfUrl as string;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [downloadFile, getDocumentDownloadUrl, isDocumentUpdated, pdfUrl],
  );

  const handlePrintFile = useCallback(
    async (payload: DocumentDownloadPayload) => {
      const url = await handleGetUrl(payload);

      printFile(url);
    },
    [handleGetUrl, printFile],
  );

  return [handlePrintFile, isDownloading] as [PrintDocument, boolean];
};
