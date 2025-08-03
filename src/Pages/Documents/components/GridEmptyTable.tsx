import EmptyTable from 'Components/EmptyTable';
import React, { useCallback, useMemo } from 'react';
import History from 'Services/History';
import { DocumentStatuses } from 'Interfaces/Document';
import useTemplateCreate from 'Hooks/Document/useTemplateCreate';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import EmptySignatureRequestsTable from 'Pages/SignatureRequests/SignatureRequestsScreen/components/SignatureRequestItem/EmptySignatureRequestsTable';
import EmptyTrashTable from 'Pages/Trash/TrashScreen/components/TrashItem/EmptyTrashTable';

export enum GridEmptyTableType {
  DOCUMENT = 'document',
  TEMPLATE = 'template',
  SIGNATURE_REQUEST = 'signature_request',
  TRASH = 'trash',
}

interface GridEmptyTableProps {
  isSetSearchFilter: boolean;
}

const GridEmptyTable = ({ isSetSearchFilter }: GridEmptyTableProps) => {
  const handlePathnameInclude = useCallback(
    text => History.location.pathname.includes(text),
    [],
  );

  const { emptyTableType, templateType } = useMemo(() => {
    if (handlePathnameInclude('templates/api')) {
      return {
        emptyTableType: GridEmptyTableType.TEMPLATE,
        templateType: DocumentStatuses.API,
      };
    }
    if (handlePathnameInclude('templates/active')) {
      return {
        emptyTableType: GridEmptyTableType.TEMPLATE,
        templateType: DocumentStatuses.ACTIVE,
      };
    }
    if (handlePathnameInclude('documents/received')) {
      return { emptyTableType: GridEmptyTableType.SIGNATURE_REQUEST };
    }
    if (handlePathnameInclude('documents/trash')) {
      return { emptyTableType: GridEmptyTableType.TRASH };
    }
    return { emptyTableType: GridEmptyTableType.DOCUMENT };
  }, [handlePathnameInclude]);

  const [handleTemplateCreateClick] = useTemplateCreate(templateType);

  const emptyTemplatesTableProps = useMemo(() => {
    return isSetSearchFilter
      ? {
          buttonText: 'Create Template',
          headerText: 'No matches found for your current search.',
          description: '',
        }
      : {
          buttonText: 'Create Template',
          headerText: "You don't have any templates yet.",
          description:
            'Create your first template to save time when repeating the same signature documents.',
        };
  }, [isSetSearchFilter]);

  const emptyDocumentsTableProps = useMemo(() => {
    return isSetSearchFilter
      ? {
          buttonText: 'Create Document',
          headerText: 'No matches found for your current search.',
          description: '',
        }
      : {
          buttonText: 'Create Document',
          headerText: "You don't have any documents yet.",
          description: 'Start uploading documents for signing and they will appear here.',
        };
  }, [isSetSearchFilter]);

  const emptySignatureRequestsTableProps = useMemo(() => {
    return isSetSearchFilter
      ? {
          headerText: 'No matches found for your current search.',
          description: '',
        }
      : {
          headerText: "You don't have any received documents yet.",
          description: 'You will see documents other users sent you to sign here.',
        };
  }, [isSetSearchFilter]);

  const emptyTrashTableProps = useMemo(() => {
    return {
      headerText: isSetSearchFilter
        ? 'No matches found for your current search.'
        : "You don't have any deleted documents yet.",
    };
  }, [isSetSearchFilter]);

  switch (emptyTableType) {
    case GridEmptyTableType.TEMPLATE: {
      return (
        <div className="documents__empty-table">
          <EmptyTable
            {...emptyTemplatesTableProps}
            onClick={() => {
              handleTemplateCreateClick && handleTemplateCreateClick();
            }}
          />
        </div>
      );
    }
    case GridEmptyTableType.SIGNATURE_REQUEST: {
      return (
        <div className="documents__empty-table">
          <EmptySignatureRequestsTable {...emptySignatureRequestsTableProps} />
        </div>
      );
    }
    case GridEmptyTableType.TRASH: {
      return (
        <div className="documents__empty-table">
          <EmptyTrashTable {...emptyTrashTableProps} />
        </div>
      );
    }
    default: {
      return (
        <div className="documents__empty-table">
          <EmptyTable
            {...emptyDocumentsTableProps}
            onClick={() => {
              History.push(AuthorizedRoutePaths.SIGN);
            }}
            iconClassName="empty-table__icon--document"
          />
        </div>
      );
    }
  }
};

export default GridEmptyTable;
