import React, { useEffect, useRef, useCallback } from 'react';
import interact from 'interactjs';
import classnames from 'classnames';
import { useToggler } from 'Hooks/Common';
import OverlayLoader from 'Components/UIComponents/UIOverlayLoader';

export interface DocumentPageProps {
  page: string;
  style?: React.CSSProperties;
  className?: string;
  onTap?: (event) => void;
  onDrop?: (event) => void;
  onLoad?: () => void;
}

const DocumentPage = ({
  style,
  page,
  onTap,
  onDrop,
  onLoad,
  className,
}: DocumentPageProps) => {
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

  const handleLoad = useCallback(() => {
    toggleIsLoading();
    if (onLoad) onLoad();
  }, [onLoad, toggleIsLoading]);

  return (
    <div className={classnames('documentPage', className)} style={style} ref={pageRef}>
      <div className="documentPage__inner">
        {isLoading && <OverlayLoader />}
        <img
          src={page}
          alt="page"
          onLoadStart={toggleIsLoading}
          onLoad={handleLoad}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default DocumentPage;
