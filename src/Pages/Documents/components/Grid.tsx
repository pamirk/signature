import React, { useCallback, useMemo, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { findIndex } from 'lodash';
import History from 'Services/History';
import { Document, DocumentStatuses, DocumentTypes } from 'Interfaces/Document';
import {
  OrderingDirection,
  SelectableItem,
  TablePaginationProps,
} from 'Interfaces/Common';
import IconSort from 'Assets/images/icons/sort.svg';
import DocumentItem from './DocumentItem';
import UISpinner from '../../../Components/UIComponents/UISpinner';
import FolderItem from './FolderItem/FolderItem';
import { useModal } from 'Hooks/Common';
import CreateFolderModal from './FolderItem/modals/CreateFolderModal';
import ChangePermissionsModal from './FolderItem/modals/ChangePermissionsModal';
import UIModal from 'Components/UIComponents/UIModal';
import { useFolderCreate, useFoldersDelete, useFolderUpdate } from 'Hooks/Folders';
import {
  Folder,
  FolderChangePermissionsPayload,
  FolderTypes,
  OpenedFolder,
} from 'Interfaces/Folder';
import Toast from 'Services/Toast';
import { useDocumentCopy, useDocumentDelete, useDocumentUpdate } from 'Hooks/Document';
import MoveToFolderModal from './modals/MoveToFolderModal';
import { GridEntityType, GridItem, SelectableGridItems } from 'Interfaces/Grid';
import GridActionsDropdown, { GridActionTypes } from './GridActionsDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFolderId } from 'Store/ducks/grid/actionCreators';
import { useGridItemsMoveToTrash, useGridItemsUpdate, useTrashEmpty } from 'Hooks/Grid';
import useFolderChangePermissions from 'Hooks/Folders/useFolderChangePermissions';
import useTeamMembersGet from 'Hooks/Team/useTeamMembersGet';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import { GridPath } from './GridPath';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { GridMobile } from './GridMobile';
import classNames from 'classnames';
import { User, UserRoles } from 'Interfaces/User';
import DocumentItemActions from './DocumentItem/DocumentItemActions';
import FolderItemActions from './FolderItem/FolderItemActions';
import { selectUser } from 'Utils/selectors';
import TemplateItem from '../../Templates/TemplatesScreen/components/TemplateItem';
import TemplateItemActions from 'Pages/Templates/TemplatesScreen/components/TemplateItem/TemplateItemActions';
import GridEmptyTable from './GridEmptyTable';
import SignatureRequestItem from 'Pages/SignatureRequests/SignatureRequestsScreen/components/SignatureRequestItem/SignatureRequestItem';
import SignatureRequestItemActions from 'Pages/SignatureRequests/SignatureRequestsScreen/components/SignatureRequestItem/SignatureRequestItemActions';
import { SignatureRequest } from 'Interfaces/SignatureRequest';
import useSignatureRequestDelete from 'Hooks/SignatureRequest/useSignatureRequestDelete';
import TrashItemActions from 'Pages/Trash/TrashScreen/components/TrashItem/TrashItemActions';
import TrashItem from 'Pages/Trash/TrashScreen/components/TrashItem/TrashItem';
import DeleteModal from 'Components/DeleteModal';

interface GridProps {
  grids: SelectableGridItems[];
  paginationProps?: TablePaginationProps;
  toggleItemSelection: (documentId: string | string[]) => void;
  requestOrdering: (key: string) => void;
  openDeleteModal: () => void;
  onDownload: () => void;
  isLoading: boolean;
  isDownloading?: boolean;
  handleGetGrid: () => void;
  setPageNumber: (pageNumber: number) => void;
  selectedItems: SelectableItem<GridItem>[];
  setFolderId: (folderId: Folder['id']) => void;
  folderId: Folder['id'] | undefined;
  clearSelection: () => void;
  rootFolderName?: string;
  isSetSearchFilter: boolean;
}

interface AllSelectedItem {
  [pageNumber: string]: boolean;
}

const defaultPaginationProps: TablePaginationProps = {
  pageCount: 0,
  pageNumber: 0,
  itemsCount: 0,
  itemsLimit: 0,
  totalItems: 0,
};

function Grid({
  grids,
  paginationProps = defaultPaginationProps,
  toggleItemSelection,
  isLoading,
  requestOrdering,
  openDeleteModal,
  onDownload,
  handleGetGrid,
  setPageNumber,
  selectedItems,
  setFolderId,
  folderId,
  clearSelection,
  rootFolderName = 'Documents',
  isSetSearchFilter,
}: GridProps) {
  const { pageNumber, itemsCount, itemsLimit, totalItems } = paginationProps;
  const [getTeamMembers] = useTeamMembersGet();
  const [changePermissions, isLoadingChangePermissions] = useFolderChangePermissions();
  const [createFolder, isLoadingCreateFolder] = useFolderCreate();
  const [updateFolder] = useFolderUpdate();
  const [deleteFolder] = useFoldersDelete();
  const [updateGridItems] = useGridItemsUpdate();
  const [updateDocument] = useDocumentUpdate();
  const [deleteDocument] = useDocumentDelete();
  const [deleteSignatureRequests] = useSignatureRequestDelete();
  const [copyTemplate] = useDocumentCopy();
  const [gridToChangePermission, setGridToChangePermission] = useState<GridItem>();
  const [selectedFolder, setSelectedFolder] = useState<Folder['id'] | undefined>();
  const [selectedEntitiesIds, setSelectedEntitiesIds] = useState<string[]>([]);
  const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
  const [openedFolders, setOpenedFolders] = useState<OpenedFolder[]>([
    { title: rootFolderName, id: undefined, permissions: [] },
  ]);
  const [allSelected, setAllSelected] = useState<AllSelectedItem>({});
  const isAllSelectedChecked = useMemo(() => allSelected[paginationProps.pageNumber], [
    allSelected,
    paginationProps.pageNumber,
  ]);
  const isMobile = useIsMobile();
  const user: User = useSelector(selectUser);
  const [moveToTrash] = useGridItemsMoveToTrash();
  const [emptyTrash] = useTrashEmpty();

  const dispatch = useDispatch();

  const isTemplate = useMemo(() => History.location.pathname.includes('templates'), []);
  const isSignatureRequest = useMemo(
    () => History.location.pathname.includes('documents/received'),
    [],
  );
  const isTrash = useMemo(
    () => History.location.pathname.includes('documents/trash'),
    [],
  );

  const getFolderType = useCallback(() => {
    if (isTemplate) {
      return FolderTypes.TEMPLATE;
    }
    if (isSignatureRequest) {
      return FolderTypes.SIGNATURE_REQUEST;
    }
    return FolderTypes.DOCUMENT;
  }, [isSignatureRequest, isTemplate]);

  const handleOpenFolder = useCallback(
    ({ title, id, permissions }) => {
      setOpenedFolders(prev => {
        const index = findIndex(openedFolders, folder => folder.id === id);
        return index >= 0
          ? prev.slice(0, index + 1)
          : prev.concat({ title, id, permissions });
      });

      setFolderId(id);
      setPageNumber(0);
    },
    [openedFolders, setFolderId, setPageNumber],
  );

  const handleCreateFolder = async ({ title }) => {
    try {
      await createFolder({
        title,
        parentId: selectedFolder || folderId,
        type: getFolderType(),
      });
      setPageNumber(0);
      handleGetGrid();
      Toast.success('Folder created!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleTemplateCopy = useCallback(
    async (templateId: Document['id']) => {
      await copyTemplate({ documentId: templateId });
      handleGetGrid();
    },
    [copyTemplate, handleGetGrid],
  );

  const handleFolderUpdate = async (title, folderId) => {
    try {
      await updateFolder({ title, folderId });
      handleGetGrid();
      Toast.success('Folder successfully updated!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleFolderDelete = async (folderId: Folder['id'], permanently = false) => {
    try {
      if (permanently) {
        await deleteFolder([folderId]);
      } else {
        await moveToTrash({ entityIds: [folderId] });
      }
      handleGetGrid();
      Toast.success('Folder deleted successfully.');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleDocumentDelete = async (
    documentId: Document['id'],
    permanently = false,
  ) => {
    try {
      if (permanently) {
        await deleteDocument({ documentId });
      } else {
        await moveToTrash({ entityIds: [documentId] });
      }
      await handleGetGrid();
      setPageNumber(0);
      isTemplate
        ? Toast.success('Template deleted successfully.')
        : Toast.success('Document deleted successfully.');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleSignatureRequestDelete = async (
    signatureRequestId: SignatureRequest['id'],
  ) => {
    try {
      await deleteSignatureRequests([signatureRequestId]);
      await handleGetGrid();
      setPageNumber(0);
      isSignatureRequest
        ? Toast.success('Signature request deleted successfully.')
        : Toast.success('Document deleted successfully.');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleDocumentUpdate = async (title, documentId, type) => {
    try {
      await updateDocument({ values: { title, documentId, type } });
      handleGetGrid();
      isTemplate
        ? Toast.success('Template successfully updated!')
        : Toast.success('Document successfully updated!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const [showCreateFolderModal, hideCreateFolderModal] = useModal(
    () => (
      <UIModal onClose={hideCreateFolderModal} className="documents__reminderModal">
        <CreateFolderModal
          onClose={hideCreateFolderModal}
          onSubmit={({ title }) => {
            handleCreateFolder({ title });
          }}
          isLoading={isLoadingCreateFolder}
        />
      </UIModal>
    ),
    [handleCreateFolder],
  );

  const openCreateFolderModal = useCallback(() => {
    showCreateFolderModal();
  }, [showCreateFolderModal]);

  const handlePermissionsUpdate = async (payload: FolderChangePermissionsPayload) => {
    try {
      await changePermissions(payload);
      clearSelection();
      handleGetGrid();
      Toast.success('Permissions successfully changed!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const [showChangePermissionsModal, hideChangePermissionsModal] = useModal(
    () => (
      <UIModal
        onClose={() => {
          hideChangePermissionsModal();
        }}
        className="documents__reminderModal"
      >
        <ChangePermissionsModal
          grid={gridToChangePermission}
          parentPermissions={openedFolders[0].permissions}
          onClose={() => {
            hideChangePermissionsModal();
          }}
          onSubmit={values => {
            handlePermissionsUpdate(values);
            hideChangePermissionsModal();
          }}
          isLoading={isLoadingChangePermissions}
        />
      </UIModal>
    ),
    [handlePermissionsUpdate],
  );

  const openFolderPermissionsModal = async () => {
    try {
      await getTeamMembers({
        orderingKey: 'role',
        orderingDirection: OrderingDirection.DESC.toUpperCase(),
      });
      showChangePermissionsModal();
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleMoveTo = async () => {
    try {
      await updateGridItems({
        entityIds: selectedEntitiesIds,
        parentId: selectedFolder,
      });
      clearSelection();
      handleGetGrid();
      Toast.success('Files successfully moved!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const [showMoveToFolderModal, hideMoveToFolderModal] = useModal(
    () => (
      <UIModal
        onClose={() => {
          hideMoveToFolderModal();
          setSelectedFolder(undefined);
        }}
        className=""
      >
        <MoveToFolderModal
          onClose={() => {
            hideMoveToFolderModal();
            setSelectedFolder(undefined);
          }}
          onSubmit={() => {
            handleMoveTo();
            hideMoveToFolderModal();
            setSelectedFolder(undefined);
          }}
          isLoading={isLoadingCreateFolder}
          setSelectedFolder={folderId => setSelectedFolder(folderId)}
          selectedFolder={selectedFolder}
          selectedEntitiesIds={selectedEntitiesIds}
          openCreateFolderModal={openCreateFolderModal}
          showWarning={isShowWarning}
          initialFolderId={!isTrash ? folderId : undefined}
          initialOpenedFolders={!isTrash ? openedFolders : [openedFolders[0]]}
          foldersType={getFolderType()}
        />
      </UIModal>
    ),
    [selectedFolder, selectedEntitiesIds, isShowWarning],
  );

  const openMoveToFolderModal = useCallback(
    (showWarning?: boolean) => {
      setIsShowWarning(!!showWarning);
      showMoveToFolderModal();
    },
    [showMoveToFolderModal],
  );

  const dropdownOptions = useMemo(
    () => [
      {
        type: GridActionTypes.DOWNLOAD,
        title: 'Download',
        onClick: onDownload,
        hidden:
          !!selectedItems.find(
            item =>
              item.entityType === GridEntityType.FOLDER ||
              item.documents?.status !== DocumentStatuses.COMPLETED,
          ) ||
          isTemplate ||
          isTrash,
      },
      {
        type: GridActionTypes.MOVE_TO,
        title: 'Move to',
        onClick: () => {
          openMoveToFolderModal(
            selectedItems.some(grid => grid.entityType === GridEntityType.FOLDER),
          );
          setSelectedEntitiesIds(selectedItems.map(grid => grid.entityId));
        },
      },
      {
        type: GridActionTypes.DELETE,
        title: 'Delete',
        onClick: openDeleteModal,
      },
    ],
    [
      isTemplate,
      isTrash,
      onDownload,
      openDeleteModal,
      openMoveToFolderModal,
      selectedItems,
    ],
  );

  const handleSelectGridItem = useCallback(
    (grid: GridItem) => {
      toggleItemSelection(grid.entityId);
      isAllSelectedChecked &&
        setAllSelected(prev => ({ ...prev, [paginationProps.pageNumber]: false }));
    },
    [isAllSelectedChecked, paginationProps.pageNumber, toggleItemSelection],
  );

  const handleSelectAll = useCallback(() => {
    const isAllToggledAlready =
      !isAllSelectedChecked &&
      grids.every(grid => selectedItems.find(item => item.id === grid.id));
    let gridIds;
    if (user.role === UserRoles.USER) {
      gridIds = grids
        .filter(grid => {
          if (grid.documents) {
            return grid.documents.userId === user.id;
          } else if (grid.folders) {
            return grid.folders.userId === user.id;
          }
          return false;
        })
        .map(grid => grid.entityId);
    } else {
      gridIds = grids.map(grid => grid.entityId);
    }

    !isAllToggledAlready && toggleItemSelection(gridIds);
    const prevValue = !!allSelected[paginationProps.pageNumber];
    setAllSelected(prev => ({ ...prev, [paginationProps.pageNumber]: !prevValue }));
  }, [
    user,
    allSelected,
    grids,
    isAllSelectedChecked,
    paginationProps.pageNumber,
    selectedItems,
    toggleItemSelection,
  ]);

  const handleEmptyTrash = useCallback(async () => {
    try {
      await emptyTrash(undefined);
      await handleGetGrid();
      setPageNumber(0);
      Toast.success('Trash has been emptied!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [emptyTrash, handleGetGrid, setPageNumber]);

  const [showEmptyTrashModal, hideEmptyTrashModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideEmptyTrashModal}
        onConfirm={() => {
          handleEmptyTrash();
          hideEmptyTrashModal();
        }}
        className={classNames('documents__deleteWrapper', { mobile: isMobile })}
        deleteTitle={'Empty trash'}
        cancelTitle={'Cancel'}
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">Confirm Trash Emptying</h5>
          <p className="modal__subTitle">
            Are you certain you wish to empty the trash? Doing so will permanently erase
            all items from your account, and this action is irreversible.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDocumentDelete],
  );

  const [renamingItemId, setRenamingItemId] = useState<string | undefined>();

  return isMobile ? (
    <GridMobile
      pageNumber={pageNumber}
      itemsLimit={itemsLimit}
      itemsCount={itemsCount}
      totalItems={totalItems}
      grids={grids}
      isLoading={isLoading}
      folderId={folderId}
      openedFolders={openedFolders}
      openCreateFolderModal={openCreateFolderModal}
      openFolderPermissionsModal={openFolderPermissionsModal}
      openMoveToFolderModal={openMoveToFolderModal}
      handleDocumentDelete={handleDocumentDelete}
      handleDocumentUpdate={handleDocumentUpdate}
      handleFolderDelete={handleFolderDelete}
      handleFolderUpdate={handleFolderUpdate}
      setGridToChangePermission={setGridToChangePermission}
      setSelectedEntitiesIds={setSelectedEntitiesIds}
      handleOpenFolder={handleOpenFolder}
      handleTemplateCopy={handleTemplateCopy}
      rootFolderName={rootFolderName}
      setRenamingItemId={setRenamingItemId}
      renamingItemId={renamingItemId}
      isSetSearchFilter={isSetSearchFilter}
      handleSignatureRequestDelete={handleSignatureRequestDelete}
      isTrash={isTrash}
      onEmptyTrash={handleEmptyTrash}
    />
  ) : (
    <div className="table documents__table">
      <div className="table__tableControls tableControls__controlsGroup">
        <div className="tableControls__left">
          <GridPath openedFolders={openedFolders} handleOpenFolder={handleOpenFolder} />
          <p className="tableControls__pagingCounter">
            {`${pageNumber * itemsLimit + 1}-${pageNumber * itemsLimit +
              (itemsCount || itemsLimit)}`}
            &nbsp;of&nbsp;
            <span>{totalItems}</span>
            &nbsp;results
          </p>
        </div>
        <div className="tableControls__actions">
          <div className="">
            {selectedItems.length > 0 && (
              <div className="tableControls__actions--selectAction">
                <div className="tableControls__actions--selectAction-count">
                  ({selectedItems.length})
                </div>
                files selected
                <GridActionsDropdown
                  options={dropdownOptions.filter(option => !option.hidden)}
                />
              </div>
            )}
          </div>
          <div className="tableControls__create-btn">
            {isTrash ? (
              <button
                className="button button--red secondary"
                onClick={showEmptyTrashModal}
              >
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
      {grids.length === 0 && !isLoading ? (
        <GridEmptyTable isSetSearchFilter={isSetSearchFilter} />
      ) : (
        <div className="table__container document">
          <div
            className={classNames('table__innerContainer document', {
              template: isTemplate || isSignatureRequest,
              trash: isTrash,
            })}
          >
            <div
              className={classNames('table__row table__header document', {
                template: isTemplate || isSignatureRequest,
              })}
            >
              <div className="table__column table__column--check select-all">
                <UICheckbox handleClick={handleSelectAll} check={isAllSelectedChecked} />
              </div>
              <div
                className={classNames('table__column table__column--text--document', {
                  template: isTemplate || isSignatureRequest,
                })}
              >
                <button
                  className="tableControls__headerControl"
                  onClick={() => requestOrdering('title')}
                >
                  <span>TITLE</span>
                  <ReactSVG src={IconSort} />
                </button>
              </div>
              <div className="table__column table__column--date document">
                <button
                  className="tableControls__headerControl"
                  onClick={() => requestOrdering('createdAt')}
                >
                  {isSignatureRequest ? (
                    <span>DATE RECEIVED</span>
                  ) : isTrash ? (
                    <span>DATE</span>
                  ) : (
                    <span>DATE CREATED</span>
                  )}
                  <ReactSVG src={IconSort} />
                </button>
              </div>
              <div className="table__column table__column--created-by">
                <button
                  className="tableControls__headerControl"
                  onClick={() => requestOrdering('name')}
                >
                  {isSignatureRequest ? <span>SENT BY</span> : <span>CREATED BY</span>}
                  <ReactSVG src={IconSort} />
                </button>
              </div>
              {isTemplate || isSignatureRequest || isTrash ? null : (
                <div className="table__column table__column--signer">
                  <span>SIGNED BY</span>
                </div>
              )}
            </div>
            {isLoading ? (
              <UISpinner
                width={50}
                height={50}
                wrapperClassName="documents__spinner spinner--main__wrapper"
              />
            ) : (
              <ul className="documents__list-container">
                {grids.map(grid => {
                  const { isSelected } = grid;

                  return (
                    grid.entityId && (
                      <div key={grid.entityId}>
                        {grid.entityType === GridEntityType.FOLDER && grid.folders && (
                          <li className={classNames('documents__list-item')}>
                            <FolderItem
                              key={grid.entityId}
                              folder={grid.folders}
                              grid={grid}
                              toggleSelect={() => handleSelectGridItem(grid)}
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
                          </li>
                        )}

                        {grid.entityType === GridEntityType.DOCUMENT && grid.documents && (
                          <li
                            className="documents__list-item"
                            style={{ display: 'flex' }}
                          >
                            {grid.documents.type === DocumentTypes.TEMPLATE ? (
                              <TemplateItem
                                key={grid.documents.id}
                                template={grid.documents}
                                toggleSelect={() =>
                                  grid.documents && toggleItemSelection(grid.documents.id)
                                }
                                isSelected={isSelected}
                                onDeleteTemplate={handleDocumentDelete}
                                onUpdateTemplate={handleDocumentUpdate}
                                onTemplateCopy={handleTemplateCopy}
                                openMoveToFolderModal={openMoveToFolderModal}
                                setSelectedEntitiesIds={entitiesIds =>
                                  setSelectedEntitiesIds(entitiesIds)
                                }
                                isSetRenamingTemplateId={
                                  renamingItemId === grid.documents.id
                                }
                                setRenamingTemplateId={setRenamingItemId}
                              />
                            ) : isTrash && grid.documents.deletedAt ? (
                              <TrashItem
                                key={grid.entityId}
                                document={grid.documents}
                                toggleSelect={() => handleSelectGridItem(grid)}
                                isSelected={isSelected}
                                onUpdateDocument={handleDocumentUpdate}
                                onDeleteDocument={handleDocumentDelete}
                                openMoveToFolderModal={openMoveToFolderModal}
                                setSelectedEntitiesIds={entitiesIds =>
                                  setSelectedEntitiesIds(entitiesIds)
                                }
                                isSetRenamingDocumentId={
                                  renamingItemId === grid.documents.id
                                }
                                setRenamingDocumentId={setRenamingItemId}
                              />
                            ) : (
                              <DocumentItem
                                key={grid.entityId}
                                grid={grid}
                                document={grid.documents}
                                toggleSelect={() => handleSelectGridItem(grid)}
                                isSelected={isSelected}
                                onUpdateDocument={handleDocumentUpdate}
                                onDeleteDocument={handleDocumentDelete}
                                openMoveToFolderModal={openMoveToFolderModal}
                                setSelectedEntitiesIds={entitiesIds =>
                                  setSelectedEntitiesIds(entitiesIds)
                                }
                                isSetRenamingDocumentId={
                                  renamingItemId === grid.documents.id
                                }
                                setRenamingDocumentId={setRenamingItemId}
                              />
                            )}
                          </li>
                        )}
                        {grid.entityType === GridEntityType.SIGNATURE_REQUEST &&
                          grid.signatureRequests?.documents && (
                            <li
                              className="documents__list-item"
                              style={{ display: 'flex' }}
                            >
                              {
                                <SignatureRequestItem
                                  key={grid.entityId}
                                  grid={grid}
                                  document={grid.signatureRequests?.documents}
                                  toggleSelect={() => handleSelectGridItem(grid)}
                                  isSelected={isSelected}
                                  onDeleteSignatureRequest={handleSignatureRequestDelete}
                                  openMoveToFolderModal={openMoveToFolderModal}
                                  setSelectedEntitiesIds={setSelectedEntitiesIds}
                                />
                              }
                            </li>
                          )}
                      </div>
                    )
                  );
                })}
              </ul>
            )}
          </div>
          <div className="table__innerContainer actions">
            <div className="table__row table__header actions">
              <div className="table__column table__column--action document">ACTIONS</div>
            </div>
            <ul className="documents__list-container">
              {grids.map(grid => {
                const { isSelected } = grid;

                return (
                  grid.entityId && (
                    <div key={grid.entityId}>
                      {grid.entityType === GridEntityType.FOLDER && grid.folders && (
                        <li className={classNames('documents__list-item')}>
                          <FolderItemActions
                            key={grid.entityId}
                            folder={grid.folders}
                            grid={grid}
                            toggleSelect={() => handleSelectGridItem(grid)}
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
                            setRenamingFolderId={setRenamingItemId}
                          />
                        </li>
                      )}

                      {grid.entityType === GridEntityType.DOCUMENT && grid.documents && (
                        <li className="documents__list-item" style={{ display: 'flex' }}>
                          {grid.documents.type === DocumentTypes.TEMPLATE ? (
                            <TemplateItemActions
                              key={grid.documents.id}
                              template={grid.documents}
                              toggleSelect={() =>
                                grid.documents && toggleItemSelection(grid.documents.id)
                              }
                              isSelected={isSelected}
                              onDeleteTemplate={handleDocumentDelete}
                              onUpdateTemplate={handleDocumentUpdate}
                              onTemplateCopy={handleTemplateCopy}
                              openMoveToFolderModal={openMoveToFolderModal}
                              setSelectedEntitiesIds={entitiesIds =>
                                setSelectedEntitiesIds(entitiesIds)
                              }
                              setRenamingTemplateId={setRenamingItemId}
                            />
                          ) : isTrash && grid.documents.deletedAt ? (
                            <TrashItemActions
                              key={grid.entityId}
                              document={grid.documents}
                              onUpdateDocument={handleDocumentUpdate}
                              onDeleteDocument={handleDocumentDelete}
                              openMoveToFolderModal={openMoveToFolderModal}
                              setSelectedEntitiesIds={entitiesIds =>
                                setSelectedEntitiesIds(entitiesIds)
                              }
                              setRenamingDocumentId={setRenamingItemId}
                            />
                          ) : (
                            <DocumentItemActions
                              key={grid.entityId}
                              grid={grid}
                              document={grid.documents}
                              toggleSelect={() => handleSelectGridItem(grid)}
                              isSelected={isSelected}
                              onUpdateDocument={handleDocumentUpdate}
                              onDeleteDocument={handleDocumentDelete}
                              openMoveToFolderModal={openMoveToFolderModal}
                              setSelectedEntitiesIds={entitiesIds =>
                                setSelectedEntitiesIds(entitiesIds)
                              }
                              setRenamingDocumentId={setRenamingItemId}
                            />
                          )}
                        </li>
                      )}
                      {grid.entityType === GridEntityType.SIGNATURE_REQUEST &&
                        grid.signatureRequests?.documents && (
                          <li
                            className="documents__list-item"
                            style={{ display: 'flex' }}
                          >
                            {
                              <SignatureRequestItemActions
                                key={grid.entityId}
                                grid={grid}
                                document={grid.signatureRequests?.documents}
                                onDeleteSignatureRequest={handleSignatureRequestDelete}
                                openMoveToFolderModal={openMoveToFolderModal}
                                setSelectedEntitiesIds={setSelectedEntitiesIds}
                              />
                            }
                          </li>
                        )}
                    </div>
                  )
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grid;
