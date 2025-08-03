import { OpenedFolder } from 'Interfaces/Folder';
import React, { useCallback, useState } from 'react';
import { ReactSVG } from 'react-svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

interface GridPathProps {
  openedFolders: OpenedFolder[];
  handleOpenFolder: (value: any) => void;
}

const GridPath = ({ openedFolders, handleOpenFolder }: GridPathProps) => {
  const [isHiddenFoldersDisplayed, setHiddenFolderDisplayed] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const renderHiddenFolders = useCallback(() => {
    const hiddenFolders = openedFolders.filter(
      (_, index) => index > 0 && index < openedFolders.length - 1,
    );

    return (
      <div
        className={classNames('tableControls__path-hiddenFolder', { mobile: isMobile })}
      >
        {hiddenFolders.map(folder => (
          <div
            className="tableControls__path-hiddenFolder--item"
            key={folder.id}
            onClick={() => {
              handleOpenFolder({
                title: folder.title,
                id: folder.id,
                permissions: folder.permissions,
              });
            }}
          >
            <div
              className={classNames('tableControls__path--item hiddenFolder', {
                mobile: isMobile,
              })}
            >
              <ReactSVG
                src={IconFolder}
                className="tableControls__path-hiddenFolder--item-icon"
              />
              <p>{folder.title}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }, [handleOpenFolder, isMobile, openedFolders]);

  if (openedFolders.length > 2) {
    const firstFolder = openedFolders[0];
    const lastFolder = openedFolders[openedFolders.length - 1];

    return (
      <div className="tableControls__path">
        <div
          onClick={() => {
            handleOpenFolder({
              title: firstFolder.title,
              id: firstFolder.id,
              permissions: firstFolder.permissions,
            });
          }}
          className={classNames('tableControls__path--item', { mobile: isMobile })}
        >
          <p>{firstFolder.title}</p>
        </div>
        <div
          className="tableControls__path--item skipDots"
          onClick={() => setHiddenFolderDisplayed(!isHiddenFoldersDisplayed)}
        >
          <div>...</div>
          {isHiddenFoldersDisplayed && renderHiddenFolders()}
        </div>
        <div
          onClick={() => {
            handleOpenFolder({
              title: lastFolder.title,
              id: lastFolder.id,
              permissions: lastFolder.permissions,
            });
          }}
          className={classNames('tableControls__path--item', { mobile: isMobile })}
        >
          <p>{lastFolder.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tableControls__path">
      {openedFolders.length > 1 &&
        openedFolders.map(folder => {
          return (
            <div
              key={folder.title}
              onClick={() => {
                handleOpenFolder({
                  title: folder.title,
                  id: folder.id,
                  permissions: folder.permissions,
                });
              }}
              className="tableControls__path--item"
            >
              {folder.title}
            </div>
          );
        })}
    </div>
  );
};

export default GridPath;
