import React, { useCallback, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import IconSort from 'Assets/images/icons/sort.svg';
import InvoiceItem from './InvoiceItem';
import { Invoice } from 'Interfaces/Billing';
import Toast from 'Services/Toast';
import { useSignedDownloadUrlGet } from 'Hooks/User';
import { useAttachmentDownload } from 'Hooks/Common';
import { SignedUrlResponse, TablePaginationProps } from 'Interfaces/Common';
import UISpinner from 'Components/UIComponents/UISpinner';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import UIPaginator from 'Components/UIComponents/UIPaginator';

interface InvoiceTableProps {
  invoiceItems: Invoice[];
  isLoading?: boolean;
  requestOrdering: (key: string) => void;
  paginationProps: TablePaginationProps;
  setPageNumber: (pageNumber: number) => void;
}

type selectedPage = { selected: number };

const InvoiceTable = ({
  invoiceItems,
  isLoading,
  requestOrdering,
  paginationProps,
  setPageNumber,
}: InvoiceTableProps) => {
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
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;

  const handleChangePage = useCallback(
    (page: selectedPage) => {
      setPageNumber(page.selected);
    },
    [setPageNumber],
  );

  return (
    <div
      className={classNames('billing__invoice settings__block--small', {
        mobile: isMobile,
      })}
    >
      <div className="billing__header">Invoices</div>
      {itemsCount > 0 && (
        <div className="table__tableControls tableControls__controlsGroup">
          <p className="tableControls__pagingCounter">
            {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit +
              (itemsCount || itemsLimit)}`}
            &nbsp;of&nbsp;
            <span>{totalItems}</span>
            &nbsp;results
          </p>
        </div>
      )}
      <div className="table billing__table-wrapper">
        <div className="table__container billing__table-container">
          <div className="table__innerContainer--invoice">
            <div className="table__row table__header">
              <div className="billing__column billing__column--date">
                <button
                  className="tableControls__headerControl"
                  onClick={() => {
                    setPageNumber(0);
                    requestOrdering('createdAt');
                  }}
                >
                  <span>DATE</span>
                  <ReactSVG src={IconSort} />
                </button>
              </div>
              <div className="billing__column billing__column--amount">
                <button
                  className="tableControls__headerControl"
                  onClick={() => {
                    setPageNumber(0);
                    requestOrdering('amount');
                  }}
                >
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
        {paginationProps.pageCount > 1 && (
          <div>
            <UIPaginator
              initialPage={paginationProps.pageNumber}
              pageCount={paginationProps.pageCount}
              onPageChange={handleChangePage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceTable;
