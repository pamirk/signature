import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UIModal from 'Components/UIComponents/UIModal';
import { Signer, Document } from 'Interfaces/Document';
import * as _ from 'lodash';
import UISpinner from 'Components/UIComponents/UISpinner';
import { useDocumentsDelete, useFormRequestGetContracts } from 'Hooks/Document';
import { selectFormRequestsContracts } from 'Utils/selectors';
import EmptyTable from 'Components/EmptyTable';
import DownloadIcon from 'Assets/images/icons/download-icon.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import Toast from 'Services/Toast';
import { useDocumentDownload } from 'Hooks/Document';
import { ReactSVG } from 'react-svg';
import DeleteModal from 'Components/DeleteModal';
import { useModal } from 'Hooks/Common';
import IconEye from 'Assets/images/icons/eye-icon.svg';
import HistoryService from 'Services/History';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import SubmittedContractsMobileView from './SubmittedContractsMobileView';

interface SigningLinkModalProps {
  documentId: Document['id'];
  onClose: () => void;
}

const SubmittedContractsModal = ({ onClose, documentId }: SigningLinkModalProps) => {
  const [getFormRequestContracts, isGettingContracts] = useFormRequestGetContracts();
  const [deleteDocuments, isDeleteLoading] = useDocumentsDelete();
  const [deleteDocumentId, setDeleteDocumentId] = useState('');
  const isMobile = useIsMobile();

  const contracts = useSelector(selectFormRequestsContracts);

  const [downloadDocument, isDownloadingDocument] = useDocumentDownload();

  const handleDocumentDownload = useCallback(
    async documentId => {
      try {
        await downloadDocument({ documentId });
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [downloadDocument],
  );

  const handleDeleteDocuments = async () => {
    await deleteDocuments([deleteDocumentId]);
    getFormRequestContracts({ documentId });
  };

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleDeleteDocuments();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this document?
          </h5>
          <p className="modal__subTitle">
            Deleting this document will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDeleteDocuments],
  );

  const openDeleteModal = (documentId: string) => {
    setDeleteDocumentId(documentId);
    showDeleteModal();
  };

  const navigateToPreview = useCallback(documentId => {
    HistoryService.push(`/documents/${documentId}/preview`);
  }, []);
  useEffect(() => {
    getFormRequestContracts({ documentId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UIModal
      onClose={onClose}
      className={classNames('submittedContractsModal', { mobile: isMobile })}
    >
      <div className="submittedContractsModal__wrapper">
        <div className="modal__header">
          <h4 className="modal__title">Submitted Contracts</h4>
          <p className="modal__subtitle"></p>
        </div>

        {isGettingContracts && (
          <div className="documents__spinner">
            <UISpinner width={50} height={50} className="spinner--main__wrapper" />
          </div>
        )}
        {contracts.length === 0 && !isGettingContracts && (
          <div className="documents__empty-table">
            <EmptyTable
              onClick={onClose}
              buttonText="Close"
              headerText="You don't have any contracts on this form yet."
            />
          </div>
        )}
        {!!contracts.length &&
          !isGettingContracts &&
          (isMobile ? (
            <SubmittedContractsMobileView
              contracts={contracts}
              handleDocumentDownload={handleDocumentDownload}
              navigateToPreview={navigateToPreview}
              openDeleteModal={openDeleteModal}
            />
          ) : (
            <div className="table__container--contracts">
              <div className="table__innerContainer">
                <div className="table__row table__header">
                  <div className="table__column table__column--text team__column-member">
                    SIGNER NAME
                  </div>
                  <div className="table__column table__column--team-email">EMAIL</div>
                  <div className="table__column table__column--status">STATUS</div>
                  <div className="table__column table__column--action team__column-actions">
                    ACTIONS
                  </div>
                </div>

                {contracts.map(contract => {
                  return (
                    <div key={contract.id} className="table__row table__dataRow">
                      <div className="table__column table__column--text team__column-member">
                        <div className="team__member">
                          <p className="team__member-name">{contract.name}</p>
                        </div>
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
                            <ReactSVG
                              src={IconRemove}
                              className="tableControls__control-icon"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </UIModal>
  );
};

export default SubmittedContractsModal;
