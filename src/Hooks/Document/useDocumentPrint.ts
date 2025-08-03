import { useCallback, useState, useEffect } from 'react';
import { SignedUrlResponse } from 'Interfaces/Common';
import { Document, DocumentDownloadTypes, DocumentStatuses } from 'Interfaces/Document';
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
        ? documentItem.downloadType === DocumentDownloadTypes.MERGED
          ? documentItem.resultPdfFileKey
          : documentItem.resultDocumentPdfFileKey
        : documentItem.pdfFileKey) as string;

      const signedUrl = (await getSignedGetUrl({
        key: documentFileKey,
      })) as SignedUrlResponse;

      const file = await downloadFile(signedUrl.result);

      const url = URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));

      setPdfUrl(URL.createObjectURL(new Blob([file], { type: 'application/pdf' })));
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
