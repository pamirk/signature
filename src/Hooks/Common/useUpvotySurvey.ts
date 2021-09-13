import { useEffect } from 'react';
import { UPVOTY_PUBLIC_KEY } from 'Utils/constants';

export default (email: string, name: string, id: string) => {
  useEffect(() => {
    if (!email || !name || !id) return;

    // Beacon
    const beacon = document.createElement('script');
    beacon.type = 'text/javascript';
    beacon.id = 'upvoty-beacon';
    beacon.async = true;

    beacon.src = 'https://signaturely.upvoty.com/javascript/upvoty.embed.js';
    beacon.onload = function() {
      //@ts-ignore
      // eslint-disable-next-line no-undef
      const upvoty = window.upvoty;

      const settings = {
        user: {
          id,
          name,
          email,
        },
        baseUrl: 'feedback.signaturely.com',
        publicKey: UPVOTY_PUBLIC_KEY,
      };

      upvoty.init('identify', settings);
    };
    if (document.getElementById('upvoty-beacon') == null) {
      document.body.appendChild(beacon);
    }
  }, [email, id, name]);
};
