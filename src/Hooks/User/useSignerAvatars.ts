import { useCallback, useEffect, useState } from 'react';
import { UserAvatar } from 'Interfaces/User';
import { NormalizedEntity } from 'Interfaces/Common';
import Toast from 'Services/Toast';
import useSignersAvatarsGet from './useSignersAvatarsGet';

export default (documentId:any) => {
  const [userAvatars, setUserAvatars] = useState<NormalizedEntity<UserAvatar> | {}>({});
  const [getSignersAvatars, isLoading] = useSignersAvatarsGet();

  const handleSignersAvatarsGet = useCallback(async () => {
    try {
      const avatars = await getSignersAvatars({ documentId });

      setUserAvatars(avatars);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [documentId, getSignersAvatars]);

  useEffect(() => {
    documentId && handleSignersAvatarsGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  return [userAvatars, isLoading] as const;
};
