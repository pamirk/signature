import React from 'react';
import DocumentPage, { DocumentPageProps } from './DocumentPage';

export interface DocumentPreviewPageProps extends DocumentPageProps {
  scale?: number;
  style?: {
    marginBottom?: number;
    width?: number;
    height?: number;
  };
  children?: React.ReactNode;
  offset?: number;
}

const DocumentPreviewPage = ({
  pageNumber,
  scale = 1,
  offset = 0,
  style,
  children,
  ...documentPageProps
}: DocumentPreviewPageProps) => {
  return (
    <div
      className="documentPage__preview-item-wrapper"
      style={{
        marginBottom: style?.marginBottom,
      }}
    >
      <DocumentPage
        pageNumber={pageNumber}
        className="documentPage__preview-item"
        scale={scale}
        style={{
          width: (style?.width as number) * scale,
          height: (style?.height as number) * scale,
        }}
        {...documentPageProps}
      />
      <div
        className="documentPage__preview-content"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: style?.width,
          left: offset,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DocumentPreviewPage;
