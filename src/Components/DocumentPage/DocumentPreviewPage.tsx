import React from 'react';
import DocumentPage, { DocumentPageProps } from './DocumentPage';

export interface DocumentPreviewPageProps extends DocumentPageProps {
  page: string;
  scale?: number;
  style?: {
    marginBottom?: number;
    width?: number;
    height?: number;
  };
  children?: React.ReactNode;
}

const DocumentPreviewPage = ({
  page,
  scale = 1,
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
        page={page}
        className="documentPage__preview-item"
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
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DocumentPreviewPage;
