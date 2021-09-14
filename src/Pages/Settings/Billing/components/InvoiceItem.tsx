import React from 'react';
import { Invoice } from 'Interfaces/Billing';
import { formatDate } from 'Utils/formatters';
import { ReactSVG } from 'react-svg';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';

interface InvoiceItemProps {
  invoice: Invoice;
  onDownload: (invoiceId: string) => void;
}

const InvoiceItem = ({
  invoice: { createdAt, amount, pdfKey },
  onDownload,
}: InvoiceItemProps) => (
  <div className="table__row billing__invoice-row">
    <div className="table__column billing__column--date">{formatDate(createdAt)}</div>
    <div className="table__column billing__column--amount">
      <div className="billing__cell--amount">${amount}</div>
      <ReactSVG
        src={DownloadIcon}
        onClick={() => {
          onDownload(pdfKey);
        }}
        className="billing__cell--download"
      />
    </div>
  </div>
);
export default InvoiceItem;
