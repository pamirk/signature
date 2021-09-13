import React, { useCallback } from 'react';
// @ts-ignore
import useDropdown from 'use-dropdown';
import { scaleOptions } from '../common/scaleOptions';
import { ReactSVG } from 'react-svg';

// @ts-ignore
import ArrowIcon from 'Assets/images/icons/select-arrow-icon.svg';

export interface ScaleDropDownProps {
  changeScale: (number:any) => void;
  documentScale: number;
}

function ScaleDropDown({ changeScale, documentScale }: ScaleDropDownProps) {
  const [containerRef, isOpen, open, close] = useDropdown();

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const onScale = ({ value }:any) => {
    changeScale(value);
    close();
  };

  const label = scaleOptions.find(item => item.value === documentScale)?.label;

  return (
    <div className="scaleDropDown__wrapper" ref={containerRef}>
      <div
        className={`scaleDropDown__select ${isOpen ? 'scaleDropDown__select--open' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="scaleDropDown__select-inner">
          <div className={`scaleDropDown__select-value-wrapper `}>
            <div className="scaleDropDown__select-value">{label}</div>
          </div>
        </div>

        <ReactSVG src={ArrowIcon} className="scaleDropDown__select-arrow" />
      </div>
      {isOpen && (
        <div className="scaleDropDown__content-wrapper">
          <div className="scaleDropDown__search-list">
            {scaleOptions
              .filter(item => !(item.value === documentScale))
              .map((item, index) => {
                const { label: optionLabel } = item;
                return (
                  <div
                    key={index}
                    onClick={() => onScale(item)}
                    className="scaleDropDown__search-item"
                  >
                    <p className="scaleDropDown__select-row">{optionLabel}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScaleDropDown;
