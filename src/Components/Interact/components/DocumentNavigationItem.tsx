import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useToggler } from 'Hooks/Common';
import { DocumentField, DocumentFieldTypes } from 'Interfaces/DocumentFields';
// import { Page } from 'react-pdf';

import OverlayLoader from 'Components/UIComponents/UIOverlayLoader';
import { useSelector } from 'react-redux';
import { selectDocumentSigner } from 'Utils/selectors';
import { useDocumentFieldColor } from 'Hooks/DocumentFields';
import { Signer } from 'Interfaces/Document';

interface DocumentFieldPreviewItemProps {
  field: DocumentField;
  yScale?: number;
  xScale?: number;
}

const DocumentFieldPreviewItem = ({
  field,
  yScale = 1,
  xScale = 1,
}: DocumentFieldPreviewItemProps) => {
  const signer = useSelector(state =>
    selectDocumentSigner(state, {
      documentId: field.documentId,
      signerId: field.signerId,
    }),
  ) as Signer;

  const fieldColor = useDocumentFieldColor(signer);

  return (
    <div
      key={field.id}
      className={classNames('interactModal__documentNavigation-field', {
        'interactModal__documentNavigation-field--name':
          field.type === DocumentFieldTypes.Name,
        'interactModal__documentNavigation-field--signature':
          field.type === DocumentFieldTypes.Signature,
        'interactModal__documentNavigation-field--initial':
          field.type === DocumentFieldTypes.Initials,
        'interactModal__documentNavigation-field--date':
          field.type === DocumentFieldTypes.Date,
        'interactModal__documentNavigation-field--text':
          field.type === DocumentFieldTypes.Text,
        'interactModal__documentNavigation-field--checkbox':
          field.type === DocumentFieldTypes.Checkbox,
        [`fieldColor__${fieldColor} fieldColor__${fieldColor}--preview`]: !!fieldColor,
      })}
      style={{
        top: field.coordinateY * yScale,
        left: field.coordinateX * xScale,
        width: (field.width || 0) * xScale,
        height: (field.height || 0) * yScale,
      }}
    />
  );
};

export interface DocumentNavigationItemProps {
  navigateToPage: () => void;
  pageNumber: number;
  pageMeta?: {
    width: number;
    height: number;
  } | null;
  fields: DocumentField[];
}

function DocumentNavigationItem({
  pageNumber,
  navigateToPage,
  pageMeta,
  fields,
}: DocumentNavigationItemProps) {
  const containerRef = useRef<HTMLLIElement>(null);
  const [fieldsXScale, setFieldsXScale] = useState(1);
  const [fieldsYScale, setFieldsYScale] = useState(1);
  const [isLoading, toggleIsLoading] = useToggler(true);
  const { pageWidth, pageHeight } = useMemo(
    () => ({ pageWidth: pageMeta?.width, pageHeight: pageMeta?.height }),
    [pageMeta],
  );

  useLayoutEffect(() => {
    if (containerRef.current && pageWidth && pageHeight) {
      setFieldsXScale(containerRef.current.clientWidth / pageWidth);
      setFieldsYScale(containerRef.current.clientWidth / pageWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageHeight, pageWidth, containerRef.current]);

  return (
    <li
      ref={containerRef}
      className="interactModal__documentNavigation-item"
      onClick={navigateToPage}
    >
      {isLoading && (
        <OverlayLoader
          iconClassName="overlayLoader__icon--preview"
          labelClassName="overlayLoader__text--preview"
        />
      )}
      {/*<Page*/}
      {/*  pageNumber={pageNumber}*/}
      {/*  onLoadSuccess={toggleIsLoading}*/}
      {/*  width={(pageWidth || 0) * fieldsXScale}*/}
      {/*  height={(pageHeight || 0) * fieldsYScale}*/}
      {/*  renderAnnotationLayer={false}*/}
      {/*/>*/}
      {fields.map(field => (
        <DocumentFieldPreviewItem
          key={field.id}
          field={field}
          xScale={fieldsXScale}
          yScale={fieldsYScale}
        />
      ))}
    </li>
  );
}

export default DocumentNavigationItem;
