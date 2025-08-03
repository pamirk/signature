import UIButton from 'Components/UIComponents/UIButton';
import React, { useCallback, useState } from 'react';

interface IndependentTooltipProps {
  content: React.ReactNode;
  onSubmit?: () => void;
}

const IndependentTooltip = ({ content, onSubmit }: IndependentTooltipProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = useCallback(() => {
    onSubmit && onSubmit();
    setIsVisible(false);
  }, [onSubmit]);

  if (!isVisible) {
    return null;
  }

  return (
    isVisible && (
      <div className="text-tooltip__independent">
        {content}
        <UIButton
          priority="primary"
          className="text-tooltip__button"
          title="Got it"
          handleClick={handleSubmit}
        />
      </div>
    )
  );
};

export default IndependentTooltip;
