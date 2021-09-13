import React from 'react';
import UISpinner from 'Components/UIComponents/UISpinner';
import DocumentActivityItemMobile from './DocumentActivityItemMobile';
import { DocumentActivity } from 'Interfaces/Document';

interface DocumentActivityListMobileViewProps {
  isLoadingDocumentActivities: boolean;
  documentActivities: DocumentActivity[];
}

const DocumentActivityListMobileView = ({
  isLoadingDocumentActivities,
  documentActivities,
}: DocumentActivityListMobileViewProps) => {
  return (
    <div className="documentPreview__activity-wrapper mobile">
      <div className="documentPreview__activity-inner mobile">
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
                  <header className="documentPreview__activity-table-header documentPreview__activity-table-row mobile">
                    <div>Activity</div>
                  </header>
                  <ul className="documentPreview__activity-table-list">
                    {documentActivities.map(documentActivity => {
                      return (
                        <DocumentActivityItemMobile
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

export default DocumentActivityListMobileView;
