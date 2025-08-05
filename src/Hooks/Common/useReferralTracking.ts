import { useCallback } from 'react';

export default () => {
  return useCallback((email: string, id: string) => {
    return new Promise(resolve => {
      // @ts-ignore
      if (!window.$FPROM) {
        resolve({
            success: false,
            message: 'Referral tracking is not initialized.',
        });
      } else {
        // @ts-ignore
        window.$FPROM.trackSignup(
          {
            email,
            uid: id,
          },
          resolve,
        );
      }
    });
  }, []);
};
