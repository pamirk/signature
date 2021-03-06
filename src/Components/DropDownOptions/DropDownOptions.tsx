import React, { useEffect, useState, useRef } from 'react';
import useDropdown from 'use-dropdown';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import IconSelectArrow from 'Assets/images/icons/select-arrow-icon.svg';
import { findOffsetParent } from 'Utils/functions';

interface DropDownOption {
  icon: string;
  name: string;
  onClick: () => void;
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}

interface DropDownOptionsInterface {
  options: DropDownOption[];
  anchorClassName: string;
}

const DropDownOptions = ({ options, anchorClassName }: DropDownOptionsInterface) => {
  const [containerRef, isOpen, open, close] = useDropdown();
  const [isPlaceOnTop, setIsPlaceOnTop] = useState(false);
  const dropdownListRef = useRef(null);
  const toggleDropdown = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };
  useEffect(() => {
    const { anchor, elementsPath } = findOffsetParent(
      containerRef.current,
      offsetParent => !!offsetParent?.classList.contains(anchorClassName),
    );
    const containerHeight = anchor?.clientHeight || 0;
    const { offsetTop } = containerRef.current;
    const offsetsSum = elementsPath.reduce<number>(
      (accum, element) => accum + element.offsetTop,
      0,
    );
    const { clientHeight: dropdownListHeight } =
      dropdownListRef.current || ({} as HTMLDivElement);

    setIsPlaceOnTop(containerHeight < dropdownListHeight + offsetTop + offsetsSum);
  }, [containerRef, isOpen, anchorClassName]);

  return (
    <div className="documents__optionsDropdown" ref={containerRef}>
      <button className="documents__optionsDropdownTrigger" onClick={toggleDropdown}>
        <span
          className={classNames('documents__optionsDropdownTrigger-text', {
            'documents__optionsDropdownTrigger-text--open': isOpen,
          })}
        >
          Options
        </span>
        <ReactSVG
          src={IconSelectArrow}
          className={classNames('documents__optionsDropdownTrigger-arrow', {
            'documents__optionsDropdownTrigger-arrow--open': isOpen,
          })}
        />
      </button>
      {isOpen && (
        <div
          className={classNames('documents__dropdownList', {
            'documents__dropdownList--top': isPlaceOnTop,
          })}
          ref={dropdownListRef}
        >
          {options
            .filter(option => !option.hidden)
            .map(option => (
              <button
                key={option.name}
                className="documents__dropdownOptionWrapper"
                disabled={option.disabled}
                onClick={() => {
                  option.onClick();
                  close();
                }}
              >
                <div
                  className={classNames('documents__dropdownOption', option.className)}
                >
                  <ReactSVG
                    src={option.icon}
                    className={classNames(
                      'documents__dropdownOption-icon',
                      option.iconClassName,
                    )}
                  />
                  <span>{option.name}</span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropDownOptions;
