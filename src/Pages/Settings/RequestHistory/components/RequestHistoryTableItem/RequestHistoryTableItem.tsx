import React from 'react';
import classNames from 'classnames';
import { formatDate, getHourFromDateString } from 'Utils/formatters';
import { RequestHistoryItem, requestTypeDescription } from 'Interfaces/RequestsHistory';

interface RequestHistoryItemItemProps {
  requestHistoryItem: RequestHistoryItem;
  className?: string;
  onDeleteSuccess?: (id: RequestHistoryItem['id']) => void;
}

const RequestHistoryItemItem = ({
  requestHistoryItem,
  className,
}: RequestHistoryItemItemProps) => {
  return (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="table__column table__column--text apiKeys__column--large">
        {requestTypeDescription[requestHistoryItem.type]}
      </div>
      <div className="table__column table__column--date apiKeys__column--medium">
        {requestHistoryItem.createdAt && formatDate(requestHistoryItem.createdAt)}
      </div>
      <div className="table__column table__column--date apiKeys__column--medium">
        {requestHistoryItem.createdAt &&
          getHourFromDateString(requestHistoryItem.createdAt)}
      </div>
      <div className="table__column table__column--text apiKeys__column--small">
        {requestHistoryItem.origin}
      </div>
    </div>
  );
};

export default RequestHistoryItemItem;
