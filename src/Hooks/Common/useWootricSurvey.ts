import { useEffect } from 'react';
import { WOOTRIC_ID } from 'Utils/constants';

export default (email: string, createdAt: Date) => {
  const timestamp = Math.floor(new Date(createdAt).getTime() / 1000);

  useEffect(() => {
    if (!email || !createdAt) return;

    const setupScript = document.createElement('script');
    setupScript.type = 'text/javascript';
    setupScript.id = 'wootric-settings';
    setupScript.async = true;
    setupScript.innerHTML = `
      window.wootricSettings = {
        email: '${email}',
        created_at: ${timestamp},
        account_token: '${WOOTRIC_ID}'
      };
    `;
    if (document.getElementById('wootric-settings') == null) {
      document.body.appendChild(setupScript);
    }

    // Beacon
    const beacon = document.createElement('script');
    beacon.type = 'text/javascript';
    beacon.id = 'wootric-beacon';
    beacon.async = true;

    beacon.src = 'https://cdn.wootric.com/wootric-sdk.js';
    beacon.onload = function() {
      //@ts-ignore
      window.wootric('run');
    };
    if (document.getElementById('wootric-beacon') == null) {
      document.body.appendChild(beacon);
    }
  }, [createdAt, email, timestamp]);
};
