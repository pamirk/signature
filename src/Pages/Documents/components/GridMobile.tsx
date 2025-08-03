import React from 'react';
import { useDispatch } from 'react-redux';
import History from 'Services/History';
import { GridEntityType, GridItem, SelectableGridItems } from 'Interfaces/Grid';
import EmptyTable from 'Components/EmptyTable';
import UISpinner from 'Components/UIComponents/UISpinner';
import DocumentItem from './DocumentItem';
import FolderItem from './FolderItem/FolderItem';
import { DocumentTypes } from 'Interfaces/Document';
import { setCurrentFolderId } from 'Store/ducks/grid/actionCreators';
import { GridPath } from './GridPath';
import { OpenedFolder } from 'Interfaces/Folder';
import TemplateItem from 'Pages/Templates/TemplatesScreen/components/TemplateItem';
import GridEmptyTable from './GridEmptyTable';
import SignatureRequestItem from 'Pages/SignatureRequests/SignatureRequestsScreen/components/SignatureRequestItem/SignatureRequestItem';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import TrashItem from 'Pages/Trash/TrashScreen/components/TrashItem/TrashItem';

interface GridMobileProps {
  pageNumber: number;
  itemsLimit: number;
  itemsCount: number;
  totalItems: number;
  grids: SelectableGridItems[];
  isLoading: boolean;
  folderId?: string;
  openedFolders: OpenedFolder[];
  openCreateFolderModal: () => void;
  openFolderPermissionsModal: () => void;
  openMoveToFolderModal: (showWarning?: boolean) => void;
  handleFolderUpdate: (title: string, folderId: string) => void;
  handleFolderDelete: (folderId: string) => void;
  handleDocumentUpdate: (title: string, documentId: string, type: DocumentTypes) => void;
  handleDocumentDelete: (documentId: string) => void;
  setGridToChangePermission: (grid?: GridItem) => void;
  setSelectedEntitiesIds: (entityIds: string[]) => void;
  handleOpenFolder: (option: any) => void;
  handleTemplateCopy: (templateId: string) => void;
  handleTemplateCreateClick?: () => void;
  handleSignatureRequestDelete: (signatureRequestId: string) => void;
  rootFolderName?: string;
  setRenamingItemId: (documentId: string | undefined) => void;
  renamingItemId: string | undefined;
  isSetSearchFilter: boolean;
  isTrash: boolean;
  onEmptyTrash: () => void;
}

export const GridMobile = ({
  pageNumber,
  itemsLimit,
  itemsCount,
  totalItems,
  grids,
  isLoading,
  folderId,
  openedFolders,
  openCreateFolderModal,
  openFolderPermissionsModal,
  openMoveToFolderModal,
  handleDocumentDelete,
  handleDocumentUpdate,
  handleFolderDelete,
  handleFolderUpdate,
  setGridToChangePermission,
  setSelectedEntitiesIds,
  handleOpenFolder,
  handleTemplateCopy,
  handleTemplateCreateClick,
  handleSignatureRequestDelete,
  rootFolderName,
  setRenamingItemId,
  renamingItemId,
  isSetSearchFilter,
  isTrash,
  onEmptyTrash,
}: GridMobileProps) => {
  const dispatch = useDispatch();

  return (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <div className="tableControls__left">
          <p className="tableControls__pagingCounter">
            {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit +
              (itemsCount || itemsLimit)}`}
            &nbsp;of&nbsp;
            <span>{totalItems}</span>
            &nbsp;results
          </p>
        </div>
        <div className="tableControls__actions mobile">
          <div className="tableControls__create-btn mobile">
            {isTrash ? (
              <button className="button button--red secondary" onClick={onEmptyTrash}>
                Empty Trash
              </button>
            ) : (
              <button
                className="button button--secondary"
                onClick={() => {
                  dispatch(setCurrentFolderId({ id: folderId }));
                  openCreateFolderModal();
                }}
              >
                Create Folder
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="table__tableControls tableControls__controlsGroup">
        <GridPath openedFolders={openedFolders} handleOpenFolder={handleOpenFolder} />
      </div>
      {grids.length === 0 && !isLoading ? (
        <GridEmptyTable isSetSearchFilter={isSetSearchFilter} />
      ) : (
        <div className="table__container">
          <div className="table__innerContainer mobile">
            <div className="table__row table__header mobile">
              <div className="table__column table__column--text mobile">
                <span>{rootFolderName}</span>
              </div>
            </div>
            {isLoading ? (
              <UISpinner
                width={50}
                height={50}
                wrapperClassName="documents__spinner spinner--main__wrapper"
              />
            ) : grids.length ? (
              grids.map(grid => {
                const { isSelected } = grid;

                if (grid.entityType === GridEntityType.FOLDER && grid.folders) {
                  return (
                    <FolderItem
                      key={grid.entityId}
                      folder={grid.folders}
                      grid={grid}
                      toggleSelect={() => {}}
                      isSelected={isSelected}
                      onUpdateFolder={handleFolderUpdate}
                      onDeleteFolder={handleFolderDelete}
                      openChangePermissionsModal={grid => {
                        openFolderPermissionsModal();
                        setGridToChangePermission(grid);
                      }}
                      openMoveToFolderModal={openMoveToFolderModal}
                      setSelectedEntitiesIds={setSelectedEntitiesIds}
                      handleOpenFolder={handleOpenFolder}
                      isSetRenamingFolderId={renamingItemId === grid.folders.id}
                      setRenamingFolderId={setRenamingItemId}
                    />
                  );
                }

                if (grid.entityType === GridEntityType.DOCUMENT && grid.documents) {
                  return grid.documents.type === DocumentTypes.TEMPLATE ? (
                    <TemplateItem
                      key={grid.documents.id}
                      template={grid.documents}
                      isSelected={isSelected}
                      onDeleteTemplate={handleDocumentDelete}
                      onUpdateTemplate={handleDocumentUpdate}
                      onTemplateCopy={handleTemplateCopy}
                      openMoveToFolderModal={openMoveToFolderModal}
                      setSelectedEntitiesIds={entitiesIds =>
                        setSelectedEntitiesIds(entitiesIds)
                      }
                      isSetRenamingTemplateId={renamingItemId === grid.documents.id}
                      setRenamingTemplateId={setRenamingItemId}
                    />
                  ) : isTrash && grid.documents.deletedAt ? (
                    <TrashItem
                      key={grid.entityId}
                      document={grid.documents}
                      toggleSelect={() => {}}
                      isSelected={isSelected}
                      onUpdateDocument={handleDocumentUpdate}
                      onDeleteDocument={handleDocumentDelete}
                      openMoveToFolderModal={openMoveToFolderModal}
                      setSelectedEntitiesIds={entitiesIds =>
                        setSelectedEntitiesIds(entitiesIds)
                      }
                      isSetRenamingDocumentId={renamingItemId === grid.documents.id}
                      setRenamingDocumentId={setRenamingItemId}
                    />
                  ) : (
                    <DocumentItem
                      key={grid.entityId}
                      grid={grid}
                      document={grid.documents}
                      toggleSelect={() => {}}
                      isSelected={isSelected}
                      onUpdateDocument={handleDocumentUpdate}
                      onDeleteDocument={handleDocumentDelete}
                      openMoveToFolderModal={openMoveToFolderModal}
                      setSelectedEntitiesIds={setSelectedEntitiesIds}
                      isSetRenamingDocumentId={renamingItemId === grid.documents.id}
                      setRenamingDocumentId={setRenamingItemId}
                    />
                  );
                }

                if (grid.entityType === GridEntityType.SIGNATURE_REQUEST) {
                  return (
                    grid.signatureRequests?.documents && (
                      <SignatureRequestItem
                        key={grid.entityId}
                        grid={grid}
                        document={grid.signatureRequests?.documents}
                        toggleSelect={() => {}}
                        isSelected={isSelected}
                        onDeleteSignatureRequest={handleSignatureRequestDelete}
                        openMoveToFolderModal={openMoveToFolderModal}
                        setSelectedEntitiesIds={setSelectedEntitiesIds}
                      />
                    )
                  );
                }

                return null;
              })
            ) : (
              <EmptyTable
                onClick={() => {
                  History.push(AuthorizedRoutePaths.SIGN);
                }}
                iconClassName="empty-table__icon--document"
                buttonText="Create Document"
                headerText="You don't have any documents yet."
                description="Start uploading documents for signing and they will appear here."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
