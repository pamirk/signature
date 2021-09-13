import React from 'react';
import * as _ from 'lodash';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import { ReactSVG } from 'react-svg';
import IconEye from 'Assets/images/icons/eye-icon.svg';

interface SubmittedContractsMobileViewProps {
  contracts: any[];
  handleDocumentDownload: (documentId: string) => void;
  navigateToPreview: (documentId: string) => void;
  openDeleteModal: (documentId: string) => void;
}

const SubmittedContractsMobileView = ({
  contracts,
  handleDocumentDownload,
  navigateToPreview,
  openDeleteModal,
}: SubmittedContractsMobileViewProps) => {
  return (
    <div className="table__container--contracts mobile">
      <div className="table__innerContainer">
        <div className="table__row table__header">
          <div className="table__column table__column--text team__column-member">
            NAME
          </div>
          <div className="table__column table__column--action team__column-actions">
            ACTIONS
          </div>
        </div>

        {contracts.map(contract => {
          return (
            <div key={contract.id} className="table__row table__dataRow">
              <div className="table__column table__column--text team__column-member">
                <div className="team__member-title">
                  <div className="team__member">
                    <p className="team__member-name">{contract.name}</p>
                  </div>
                  <div className="table__column table__column--team-email">
                    {contract.email}
                  </div>
                  <div className="table__column table__column--status">
                    <div
                      className={`documents__documentStatus documents__documentStatus--${contract.document.status}`}
                    >
                      <span className="documents__documentStatus-text">
                        {contract.document.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team__column-actions table__column table__column--action">
                <div className="table__actions">
                  <div
                    className="table__actions-item"
                    onClick={() => handleDocumentDownload(contract.document.id)}
                  >
                    <ReactSVG
                      src={DownloadIcon}
                      className="submittedContractsModal__tableAction-icon"
                    />
                  </div>
                  <div
                    className="table__actions-item"
                    onClick={() => navigateToPreview(contract.document.id)}
                  >
                    <ReactSVG
                      src={IconEye}
                      className="submittedContractsModal__tableAction-icon"
                    />
                  </div>
                  <button
                    onClick={() => openDeleteModal(contract.document.id)}
                    className="tableControls__control tableControls__control--red"
                  >
                    <ReactSVG src={IconRemove} className="tableControls__control-icon" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmittedContractsMobileView;
