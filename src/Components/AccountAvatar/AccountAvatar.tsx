import Avatar from 'Components/Avatar/Avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAvatarInfo } from 'Utils/selectors';

interface AccountAvatarProps {
  className?: string;
}

export const AccountAvatar = ({ className }: AccountAvatarProps) => {
  const { name, email, avatarUrl } = useSelector(selectAvatarInfo);

  return <Avatar name={name} email={email} avatarUrl={avatarUrl} className={className} />;
};

export default AccountAvatar;
