import React, { useEffect, useRef, useCallback, useState } from 'react';
import interact from 'interactjs';
import classnames from 'classnames';
import { useIsMobile, useIsTablet, useToggler } from 'Hooks/Common';
import OverlayLoader from 'Components/UIComponents/UIOverlayLoader';
// import { Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

type RenderMode = 'canvas' | 'custom' | 'none';

export interface DocumentPageProps {
  pageNumber: number;
  scale?: number;
  style?: React.CSSProperties;
  className?: string;
  onTap?: (event) => void;
  onDrop?: (event) => void;
  onLoad?: () => void;
  renderAnnotationLayer?: boolean;
}

const DocumentPage = ({
  style,
  pageNumber,
  onTap,
  onDrop,
  onLoad,
  className,
  scale,
  renderAnnotationLayer = true,
}: DocumentPageProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [renderMode, setRenderMode] = useState<RenderMode>(
    isMobile || isTablet ? 'custom' : 'canvas',
  );
  const [isLoading, toggleIsLoading] = useToggler(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interactable;

    if (pageRef.current)
      interactable = interact(pageRef.current)
        .dropzone({
          enabled: true,
          accept: '.draggable',
          overlap: 1,
          ondrop: onDrop,
        })
        .on('tap', event => onTap && onTap(event));

    return () => {
      if (interactable) interactable.unset();
    };
  }, [pageRef, onTap, onDrop]);

  const handleLoad = useCallback(
    async page => {
      const operatorList = await page.getOperatorList();

      const isSomeImage = operatorList.fnArray.some(
        // fn => fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintJpegXObject,
        // fn => fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintInlineImageXObject,
      );

      if (isSomeImage) {
        setRenderMode('canvas');
      }

      toggleIsLoading();
      if (onLoad) onLoad();
    },
    [onLoad, toggleIsLoading],
  );

  return (
    <div className={classnames('documentPage', className)} style={style} ref={pageRef}>
      <div className="documentPage__inner">
        {isLoading && <OverlayLoader />}
        {/*<Page*/}
        {/*  className="documentPage__inner-pdf_page"*/}
        {/*  pageNumber={pageNumber}*/}
        {/*  scale={scale}*/}
        {/*  onLoadSuccess={handleLoad}*/}
        {/*  renderAnnotationLayer={renderAnnotationLayer}*/}
        {/*  renderTextLayer={false}*/}
        {/*  renderMode={renderMode}*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default DocumentPage;
