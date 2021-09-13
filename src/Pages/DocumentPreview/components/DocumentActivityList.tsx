import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useDocumentActivitiesGet } from 'Hooks/Document';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import { Document, DocumentActivity } from 'Interfaces/Document';

import UISpinner from 'Components/UIComponents/UISpinner';
import DocumentActivityItem from './DocumentActivityItem';
import DocumentActivityListMobileView from './DocumentActivityListMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface DocumentActivityListProps {
  documentId: Document['id'];
}

const DocumentActivityList = ({ documentId }: DocumentActivityListProps) => {
  const location = useLocation();
  const [getDocumentActivities, isLoadingDocumentActivities] = useDocumentActivitiesGet();
  const [documentActivities, setDocumentActivities] = useState<DocumentActivity[]>([]);
  const isMobile = useIsMobile();

  const handleDocumentActivitiesGet = useCallback(async documentId => {
    try {
      const activities = await getDocumentActivities({ documentId });

      if (isNotEmpty(activities)) {
        setDocumentActivities(activities);
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleDocumentActivitiesGet(documentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substr(1);
      const targetElement = document.getElementById(targetId);

      targetElement &&
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
    }
  }, [location.hash]);

  return isMobile ? (
    <DocumentActivityListMobileView
      isLoadingDocumentActivities={isLoadingDocumentActivities}
      documentActivities={documentActivities}
    />
  ) : (
    <div className="documentPreview__activity-wrapper">
      <div className="documentPreview__activity-inner">
        <p id="document-activity" className="documentPreview__activity-title">
          Document Activity
        </p>
        <div className="documentPreview__activity-table-wrapper">
          {isLoadingDocumentActivities ? (
            <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />
          ) : (
            <>
              {documentActivities.length ? (
                <>
                  <header className="documentPreview__activity-table-header documentPreview__activity-table-row">
                    <div className="documentPreview__activity-table-col documentPreview__activity-table-col--icon"></div>
                    <div className="documentPreview__activity-table-col documentPreview__activity-table-col--date">
                      <p className="documentPreview__activity-table-header-title">Date</p>
                    </div>
                    <div className="documentPreview__activity-table-col documentPreview__activity-table-col--actions">
                      <p className="documentPreview__activity-table-header-title">
                        Actions
                      </p>
                    </div>
                  </header>
                  <ul className="documentPreview__activity-table-list">
                    {documentActivities.map(documentActivity => {
                      return (
                        <DocumentActivityItem
                          key={documentActivity.id}
                          documentActivity={documentActivity}
                        />
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="documentPreview__activity-table-empty">
                  <span className="documentPreview__activity-table-empty-title">
                    There is no activities for this document yet.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentActivityList;
