import React from 'react';
import dayjs from 'dayjs';
import { DocumentActivity, DocumentActivityTypes } from 'Interfaces/Document';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { documentActivityContentByType } from '../constants';

interface DocumentActivityItemProps {
  documentActivity: DocumentActivity;
}

const DocumentActivityItem = ({ documentActivity }: DocumentActivityItemProps) => {
  const user: User = useSelector(selectUser);
  const { type, signers, sourceIP, createdAt } = documentActivity;
  const { icon, title } = documentActivityContentByType[type];

  return (
    <li className="documentPreview__activity-table-item documentPreview__activity-table-row">
      <div className="documentPreview__activity-table-col documentPreview__activity-table-col--icon">
        <img src={icon} className="documentPreview__activity-table-icon" alt={type} />
      </div>
      <div className="documentPreview__activity-table-col documentPreview__activity-table-col--date">
        <div className="documentPreview__activity-table-info-wrapper">
          <p className="documentPreview__activity-table-info-type">{title} At:</p>
          <p className="documentPreview__activity-table-info-date">
            {dayjs(createdAt).format('MMM DD, YYYY')}
          </p>
          <p className="documentPreview__activity-table-info-time">
            {dayjs(createdAt).format('HH:mm:ss [UTC]Z')}
          </p>
        </div>
      </div>
      <div className="documentPreview__activity-table-col documentPreview__activity-table-col--actions">
        <ul className="documentPreview__activity-table-actions-list">
          {signers &&
            !!signers.length &&
            signers.map(signer => (
              <li
                key={`${signer.email}_${signer.name}`}
                className="documentPreview__activity-table-actions-item"
              >
                <p className="documentPreview__activity-table-actions-label">
                  {signer.name && (
                    <>
                      {signer.name}&nbsp;
                      {user.email === signer.email && (
                        <span className="documentPreview__activity-table-actions-value">
                          (you)&nbsp;
                        </span>
                      )}
                      <span className="documentPreview__activity-table-actions-value">
                        |&nbsp;
                      </span>
                    </>
                  )}
                  <span className="documentPreview__activity-table-actions-value">
                    {signer.email}
                  </span>
                </p>
              </li>
            ))}
          {type === DocumentActivityTypes.COMPLETE && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                Document Completed
              </p>
            </li>
          )}
          {type === DocumentActivityTypes.REVERT && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                Document Reverted to Draft
              </p>
            </li>
          )}
          {type === DocumentActivityTypes.CREATE && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                Document Created
              </p>
            </li>
          )}
          {type === DocumentActivityTypes.UPDATE && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                Document Updated
              </p>
            </li>
          )}
          {type === DocumentActivityTypes.EXPIRE && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                Document Expired
              </p>
            </li>
          )}
          {!!sourceIP && (
            <li className="documentPreview__activity-table-actions-item">
              <p className="documentPreview__activity-table-actions-label">
                From IP:&nbsp;
                <span className="documentPreview__activity-table-actions-value">
                  {sourceIP}
                </span>
              </p>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
};

export default DocumentActivityItem;
