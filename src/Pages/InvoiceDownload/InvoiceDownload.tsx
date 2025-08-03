import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useAttachmentDownload } from 'Hooks/Common';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { Invoice, InvoiceDownloadLink } from 'Interfaces/Billing';
import { useGetInvoiceDownloadLink } from 'Hooks/Billing';
import { isNotEmpty } from 'Utils/functions';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface PageParams {
  invoiceId: Invoice['id'];
}

export const InvoiceDownload = ({ location, match }: RouteChildrenProps<PageParams>) => {
  const [getInvoiceDownloadLink] = useGetInvoiceDownloadLink();
  const [downloadInvoice, isReady] = useAttachmentDownload();
  const handleDownloadInvoice = useCallback(
    async (payload: InvoiceDownloadLink) => {
      try {
        const result = await getInvoiceDownloadLink(payload);
        if (isNotEmpty(result)) {
          await downloadInvoice(result.result);
        }
        Toast.success('File is downloading');
        History.push(AuthorizedRoutePaths.SETTINGS_BILLING);
      } catch (error) {
        console.error(error);
        Toast.handleErrors(error);
      }
    },
    [downloadInvoice, getInvoiceDownloadLink],
  );

  const invoiceId = match?.params.invoiceId;
  const searchString = location.search;

  const hash = useMemo(() => {
    const urlParams = new URLSearchParams(searchString.replace('?', ''));
    return urlParams.get('hash');
  }, [searchString]);

  useEffect(() => {
    if (invoiceId && hash && isReady) {
      handleDownloadInvoice({ invoiceId, hash });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, hash, isReady]);

  return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
};
