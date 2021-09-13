import { useCallback, useState, useEffect } from 'react';
import { SignedUrlResponse } from 'Interfaces/Common';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { useSignedGetUrl } from 'Hooks/User';
import { useDownloadFileByUrl } from 'Hooks/Requisite';
import { usePrint } from 'Hooks/Common';

interface PrintDocument {
  (): void;
}

export default (documentItem: Document) => {
  const [getSignedGetUrl] = useSignedGetUrl();
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [downloadFile, isDownloading] = useDownloadFileByUrl();
  const printFile = usePrint();

  useEffect(() => {
    setIsDocumentUpdated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentItem]);

  const handleGetUrl = useCallback(async (): Promise<string> => {
    if (isDocumentUpdated) {
      const documentFileKey = (documentItem.status === DocumentStatuses.COMPLETED
        ? documentItem.resultPdfFileKey
        : documentItem.pdfFileKey) as string;

      const signedUrl = (await getSignedGetUrl({
        key: documentFileKey,
      })) as SignedUrlResponse;

      let file:any = await downloadFile(signedUrl.result);
      if (file.type !== 'application/pdf')
        file = file.slice(0, file.size, 'application/pdf');

      const url = URL.createObjectURL(file);

      setPdfUrl(URL.createObjectURL(file));
      setIsDocumentUpdated(false);

      return url;
    }

    return pdfUrl as string;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentItem, downloadFile, isDocumentUpdated, pdfUrl]);

  const handlePrintFile = useCallback(async () => {
    const url = await handleGetUrl();

    printFile(url);
  }, [handleGetUrl, printFile]);

  return [handlePrintFile, isDownloading] as [PrintDocument, boolean];
};
