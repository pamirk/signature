import React from 'react';
import { ReactSVG } from 'react-svg';
import { Folder } from 'Interfaces/Folder';
import { GridItem } from 'Interfaces/Grid';
import DropDownOptionsMobile from '../DocumentItem/DropDownOptionsMobile';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import EditableTitle from '../DocumentItem/EditableTitle';
import { formatFolderName } from 'Utils/formatters';

interface FolderItemMobileViewProps {
  folder: Folder;
  grid: GridItem;
  isActiveEditForm: boolean;
  options: any[];
  handleOpenFolder: ({ title, id, permissions }) => void;
  handleUpdateFolder: ({ title }) => void;
}

export const FolderItemMobileView = ({
  folder,
  grid,
  isActiveEditForm,
  handleOpenFolder,
  handleUpdateFolder,
  options,
}: FolderItemMobileViewProps) => {
  return (
    <div className="table__row table__dataRow mobile">
      <div
        className="table__column--text mobile"
        onClick={() =>
          handleOpenFolder({
            title: folder.title,
            id: folder.id,
            permissions: grid.permissions,
          })
        }
      >
        <ReactSVG src={IconFolder} className="documents__dropdownOption-icon" />
        {isActiveEditForm ? (
          <EditableTitle
            documentTitle={folder?.title || ''}
            onSubmit={handleUpdateFolder}
          />
        ) : (
          formatFolderName(folder?.title || '')
        )}
      </div>
      <div className="table__column table__column--action mobile">
        {!!options.length && (
          <DropDownOptionsMobile options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};
