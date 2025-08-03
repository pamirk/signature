import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import { ReactSVG } from 'react-svg';
import { concat, findIndex, take } from 'lodash';
import IconCreateFolder from 'Assets/images/icons/create-folder-icon.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import SkipDotsIcon from 'Assets/images/icons/skip-dots.svg';
import { Folder, FolderTypes } from 'Interfaces/Folder';
import { useFoldersGet } from 'Hooks/Folders';
import { useDispatch, useSelector } from 'react-redux';
import { selectFoldersByType } from 'Utils/selectors';
import { setCurrentFolderId } from 'Store/ducks/grid/actionCreators';
import useIsMobile from 'Hooks/Common/useIsMobile';

interface MoveToFolderModalProps {
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  setSelectedFolder: (folderId: Folder['id'] | undefined) => void;
  selectedFolder: Folder['id'] | undefined;
  openCreateFolderModal: () => void;
  selectedEntitiesIds: Folder['id'][] | undefined;
  initialFolderId?: Folder['id'];
  initialOpenedFolders?: { id: string | undefined; title: string }[];
  foldersType: FolderTypes;
  showWarning: boolean;
}

const MoveToFolderModal = ({
  onSubmit,
  setSelectedFolder,
  selectedFolder,
  openCreateFolderModal,
  selectedEntitiesIds,
  initialFolderId,
  initialOpenedFolders,
  foldersType,
  showWarning,
}: MoveToFolderModalProps) => {
  const [getFolders] = useFoldersGet();
  const folders = useSelector(selectFoldersByType(foldersType));
  const availableFolders = folders.filter(folder => !folder.deletedAt);

  const [openedFolders, setOpenedFolders] = useState(
    initialOpenedFolders || [{ title: 'Documents', id: undefined }],
  );
  const [isFoldersListDisplayed, setFoldersListDisplayed] = useState<boolean>(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-undef
  const isMobile = useIsMobile();

  const handleOpenFolder = ({ title, id }) => {
    dispatch(setCurrentFolderId({ id }));
    let foldersArray;
    const index = findIndex(openedFolders, function(o) {
      return o.id === id;
    });

    if (index >= 0) {
      foldersArray = take(openedFolders, index + 1);
      getFolders({ id });
    } else {
      foldersArray = concat(openedFolders, [{ title, id }]);
      getFolders({ id });
    }
    setOpenedFolders(foldersArray);
  };

  useEffect(() => {
    getFolders({ id: initialFolderId });
    setSelectedFolder(openedFolders[openedFolders.length - 1].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames('moveToFolderModal__wrapper', { mobile: isMobile })}>
      <div className="moveToFolderModal__header">
        <h4 className="moveToFolderModal__title">Move to folder</h4>
        {showWarning && (
          <p className="moveToFolderModal__subTitle">
            Warning: if the creator of a folder doesn&apos;t have permissions to the
            folder you are moving it to, he will get permissions to that folder. If you
            want the creator to not have access to it, you can change the creator&apos;s
            permissions to the folder you are moving before moving it.
          </p>
        )}
      </div>
      <div className="moveToFolderModal__content">
        <div className="moveToFolderModal__breadcrumbsWrapper">
          <div className="moveToFolderModal__breadcrumbsInner">
            {openedFolders.length > 2 ? (
              <>
                <div
                  onClick={() => {
                    handleOpenFolder({
                      title: openedFolders[0].title,
                      id: openedFolders[0].id,
                    });
                    setSelectedFolder(openedFolders[0].id);
                  }}
                  className="moveToFolderModal__breadcrumbsItem"
                >
                  <p>{openedFolders[0].title}</p>
                </div>
                <div className="moveToFolderModal__breadcrumbsItem">
                  <div
                    className="moveToFolderModal__skipDots"
                    onClick={() => setFoldersListDisplayed(!isFoldersListDisplayed)}
                  >
                    <img src={SkipDotsIcon} alt="..." />
                    {isFoldersListDisplayed && (
                      <div className="moveToFolderModal__hiddenFolder">
                        {openedFolders
                          .filter(
                            (_, index) => index > 0 && index < openedFolders.length - 1,
                          )
                          .map(folder => (
                            <div
                              className="moveToFolderModal__hiddenFolder--item"
                              key={folder.id}
                              onClick={() => {
                                handleOpenFolder({
                                  title: folder.title,
                                  id: folder.id,
                                });
                                setSelectedFolder(folder.id);
                              }}
                            >
                              <div className="moveToFolderModal__item hiddenFolder">
                                <ReactSVG
                                  src={IconFolder}
                                  className="moveToFolderModal__item-icon"
                                />
                                <p>{folder.title}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => {
                    handleOpenFolder({
                      title: openedFolders[openedFolders.length - 1].title,
                      id: openedFolders[openedFolders.length - 1].id,
                    });
                    setSelectedFolder(openedFolders[openedFolders.length - 1].id);
                  }}
                  className="moveToFolderModal__breadcrumbsItem"
                >
                  <p>{openedFolders[openedFolders.length - 1].title}</p>
                </div>
              </>
            ) : (
              openedFolders.map(folder => {
                return (
                  <div
                    key={folder.title}
                    onClick={() => {
                      handleOpenFolder({ title: folder.title, id: folder.id });
                      setSelectedFolder(folder.id);
                    }}
                    className="moveToFolderModal__breadcrumbsItem"
                  >
                    <p>{folder.title}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {availableFolders
          .filter(folder => !selectedEntitiesIds?.includes(folder.id))
          .map(folder => (
            <div
              key={folder.id}
              onClick={() => {
                setSelectedFolder(folder.id);
              }}
              onDoubleClick={() => {
                setSelectedFolder(folder.id);
                handleOpenFolder({ title: folder.title, id: folder.id });
              }}
              className={classNames('moveToFolderModal__itemWrapper', {
                'moveToFolderModal__itemWrapper-hover': selectedFolder === folder.id,
              })}
            >
              <div className="moveToFolderModal__item">
                <ReactSVG src={IconFolder} className="moveToFolderModal__item-icon" />
                <p>{folder.title}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="moveToFolderModal__controls">
        <div onClick={openCreateFolderModal}>
          <ReactSVG
            src={IconCreateFolder}
            className="moveToFolderModal__controls--icon"
          />
        </div>
        <UIButton
          priority="primary"
          disabled={false}
          isLoading={false}
          title="Move to folder"
          handleClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default MoveToFolderModal;
