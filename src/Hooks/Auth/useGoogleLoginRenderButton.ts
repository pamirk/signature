import { useCallback } from 'react';
import useGoogleIdentityServiceGet from './useGoogleIdentityServiceGet';

interface Props {
  onSubmit: (response) => void;
}

export default (props: Props) => {
  const gis = useGoogleIdentityServiceGet({ ...props });

  const renderButton = useCallback(
    (ref: HTMLButtonElement | null, params: any) => {
      if (gis && ref) {
        gis.renderButton(ref, params);
      }
    },
    [gis],
  );

  return renderButton;
};
