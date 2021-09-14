import classNames from 'classnames';
import Avatar from 'Components/Avatar';
import { AvatarUrl } from 'Interfaces/User';
import React from 'react';

interface SignerItemLabelProps {
  avatarUrl: AvatarUrl;
  name: string;
  email: string;
  isSelected?: boolean;
}

const SignerItemLabel = ({
  avatarUrl,
  name,
  email,
  isSelected,
}: SignerItemLabelProps) => {
  return (
    <div className="signerItemLabel">
      <Avatar avatarUrl={avatarUrl} name={name} email={email} />
      <div
        className={classNames(
          'dropDownUser__trigger dropDownUser__trigger--send-reminder',
          {
            'signerItemLabel__optionItem--checked': isSelected !== false,
          },
        )}
      >
        <span className="signerItemLabel__text-item">{name}</span>
        <span className="signerItemLabel__text-item">{email}</span>
      </div>
    </div>
  );
};

export default SignerItemLabel;
