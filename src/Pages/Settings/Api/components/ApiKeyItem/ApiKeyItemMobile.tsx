import classNames from 'classnames';
import DropDownOptions from 'Components/DropDownOptions';
import { ApiKey } from 'Interfaces/ApiKey';
import React from 'react';
import { formatDate } from 'Utils/formatters';

interface ApiKeyItemMobile {
  apiKey: ApiKey;
  options: any[];
  className?: string;
}

const ApiKeyItemMobile = ({ apiKey, options, className }: ApiKeyItemMobile) => {
  return (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="apiKeys__innerContainer">
        <div>
          <div className="table__column table__column--text apiKeys__mobileText title">
            {apiKey.name}
          </div>
          <div className="table__column table__column--text apiKeys__mobileText">
            {apiKey.prefix}
          </div>
          <div className="table__column table__column--date apiKeys__mobileText">
            {apiKey.createdAt && formatDate(apiKey.createdAt)}
          </div>
          <div className="table__column table__column--text apiKeys__mobileText">
            {apiKey.requests}
          </div>
        </div>
        <div className="apiKeys__optionsButton">
          <DropDownOptions options={options} anchorClassName="table__container" />
        </div>
      </div>
    </div>
  );
};

export default ApiKeyItemMobile;
