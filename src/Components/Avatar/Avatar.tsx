import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { AvatarUrl } from 'Interfaces/User';
import React from 'react';
import { getAvatarContent } from 'Utils/formatters';

interface AvatarProps {
  className?: string;
  name?: string;
  email?: string;
  avatarUrl?: AvatarUrl;
}

export const Avatar = ({ className, name, email, avatarUrl }: AvatarProps) => {
  const isMobile = useIsMobile();
  return (
    <div className={classNames('avatar', className, { mobile: isMobile })}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="avatar" />
      ) : (
        <div className={classNames('avatar-initials', { mobile: isMobile })}>
          <div className="avatar-initials__content">{getAvatarContent(name, email)}</div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
