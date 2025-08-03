import { useCallback, useEffect, useState } from 'react';
import { GOOGLE_CLIENT_ID } from 'Utils/constants';
declare let google: any;

interface Gis {
  renderButton: (ref: HTMLButtonElement, params: any) => void;
}

interface Props {
  onSubmit: (response) => void;
}

export default ({ onSubmit }: Props) => {
  const [gis, setGis] = useState<Gis | null>(null);

  const initGis = useCallback(async () => {
    if (google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: onSubmit,
      });
      google.accounts.id.prompt();
      setGis(google.accounts.id);
    }
  }, [onSubmit]);

  useEffect(() => {
    if (!gis) {
      initGis();
    }
  }, [gis, initGis]);

  return gis;
};
