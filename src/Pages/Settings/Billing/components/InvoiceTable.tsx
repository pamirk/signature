import React, { useCallback, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
// @ts-ignore
import IconSort from 'Assets/images/icons/sort.svg';
import InvoiceItem from './InvoiceItem';
import { Invoice } from 'Interfaces/Billing';
import Toast from 'Services/Toast';
import { useSignedDownloadUrlGet } from 'Hooks/User';
import { useAttachmentDownload } from 'Hooks/Common';
import { SignedUrlResponse } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
interface InvoiceTableProps {
  invoiceItems: Invoice[];
  isLoading?: boolean;
}

const InvoiceTable = ({ invoiceItems, isLoading }: InvoiceTableProps) => {
  const [getSignedUrl] = useSignedDownloadUrlGet();
  const [downloadInvoice] = useAttachmentDownload();
  const isEmpty = useMemo(() => invoiceItems.length === 0, [invoiceItems.length]);
  const handleDownloadInvoice = useCallback(
    async (key: string) => {
      try {
        const { result } = (await getSignedUrl({ key })) as SignedUrlResponse;
        await downloadInvoice(result);
        Toast.success('File is downloading');
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [downloadInvoice, getSignedUrl],
  );
  const isMobile = useIsMobile();

  return (
    <div
      className={classNames('billing__invoice settings__block--small', {
        mobile: isMobile,
      })}
    >
      <div className="billing__header">Invoices</div>
      <div className="table">
        <div className="table__container billing__table-container">
          <div className="table__innerContainer">
            <div className="table__row table__header">
              <div className="table__column billing__column--date">
                <button className="tableControls__headerControl">
                  <span>DATE</span>
                  <ReactSVG src={IconSort} />
                </button>
              </div>
              <div className="table__column billing__column--amount">
                <button className="tableControls__headerControl">
                  <span>AMOUNT</span>
                  <ReactSVG src={IconSort} />
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="billing__invoice-content">
                <UISpinner
                  width={50}
                  height={50}
                  wrapperClassName="spinner--main__wrapper billing__invoice-spinner"
                />
              </div>
            ) : (
              <div className="billing__invoice-content">
                {isEmpty ? (
                  <div className="billing__invoice-empty">
                    You don&apos;t have any invoices yet
                  </div>
                ) : (
                  invoiceItems.map(invoice => (
                    <InvoiceItem
                      key={invoice.id}
                      invoice={invoice}
                      onDownload={handleDownloadInvoice}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
