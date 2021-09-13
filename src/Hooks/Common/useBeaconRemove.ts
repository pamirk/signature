import { useEffect } from 'react';

type displayStatus = 'none' | 'block';

function setBeaconContainerStatus(status: displayStatus) {
  const beaconContainer = document.getElementById('beacon-container');

  if (beaconContainer) {
    beaconContainer.style.display = status;

    return true;
  }

  return false;
}

function hideBeacon() {
  const isSuccessful = setBeaconContainerStatus('none');
  //@ts-ignore
  // eslint-disable-next-line no-undef
  const beacon = window.Beacon;

  if (!isSuccessful && beacon) {
    beacon('on', 'ready', () => {
      setBeaconContainerStatus('none');
    });
  }
}

function showBeacon() {
  setBeaconContainerStatus('block');
  const isSuccessful = setBeaconContainerStatus('block');

  //@ts-ignore
  // eslint-disable-next-line no-undef
  const beacon = window.Beacon;

  if (!isSuccessful && beacon) {
    beacon('on', 'ready', () => {
      setBeaconContainerStatus('block');
    });
  }
}

export default () => {
  useEffect(() => {
    try {
      //@ts-ignore
      // eslint-disable-next-line no-undef
      const beacon = window.Beacon;

      if (beacon) {
        hideBeacon();
      } else {
        window.addEventListener('load', hideBeacon);
      }

      return () => {
        window.removeEventListener('load', hideBeacon);
        showBeacon();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);
};
