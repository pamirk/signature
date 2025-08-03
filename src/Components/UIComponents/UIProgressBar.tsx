import React, { useCallback, useEffect, useState } from 'react';

const stages = {
  STAGE_1: 10,
  STAGE_2: 50,
  STAGE_3: 100,
};

interface UIProgressBarProps {
  percent?: number;
  withStaging?: boolean;
}

const UIProgressBar = ({ percent = 0, withStaging = true }: UIProgressBarProps) => {
  const [dynamicalProgress, setDynamicalProgress] = useState(0);

  const handleSetDynamicalProgress = useCallback(
    offset =>
      setTimeout(() => {
        setDynamicalProgress(dynamicalProgress + offset);
      }, 100),
    [dynamicalProgress],
  );

  const setProgress = useCallback(() => {
    if (dynamicalProgress >= stages.STAGE_3) {
      setDynamicalProgress(stages.STAGE_3);
    } else if (percent < stages.STAGE_2 && dynamicalProgress > stages.STAGE_2) {
      setDynamicalProgress(stages.STAGE_2);
    } else if (percent === stages.STAGE_2 && dynamicalProgress < stages.STAGE_2) {
      handleSetDynamicalProgress(3);
    } else if (dynamicalProgress < stages.STAGE_2) {
      handleSetDynamicalProgress(0.5);
    } else if (dynamicalProgress < stages.STAGE_3) {
      handleSetDynamicalProgress(1.5);
    }
  }, [dynamicalProgress, handleSetDynamicalProgress, percent]);

  useEffect(() => {
    if (withStaging) {
      setProgress();
    }
  }, [withStaging, setProgress]);

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__filter"
        style={{ width: `${withStaging ? dynamicalProgress : percent}%` }}
      />
    </div>
  );
};
export default UIProgressBar;
