import loadScript from 'load-script';
import Axios from 'axios';
import { sleep } from 'Utils/functions';
import { lessThan40MB } from 'Utils/validation';
import { FileDownloadCallback, ErrorCallback } from './Interfaces';

interface ShowParams {
  accessToken: string;
  onPick?: FileDownloadCallback;
  onCancel?: () => void;
  onError?: ErrorCallback;
  extentions?: string[];
}

interface BoxFile {
  name: string;
  is_download_available: boolean;
  authenticated_download_url: string;
  size: number;
}

export enum BoxStorageKeys {
  ACCESS_TOKEN = 'boxAccessToken',
  REFRESH_TOKEN = 'boxRefreshToken',
  ACCESS_TOKEN_EXPIRES_AT = 'boxAccessTokenExpiresAt',
}

loadScript('https://cdn01.boxcdn.net/platform/elements/11.0.2/en-US/picker.js');

class BoxContentPickerApi {
  show = async ({
    accessToken,
    onPick,
    onCancel,
    onError,
    extentions = [],
  }: ShowParams) => {
    await sleep(0);
    // @ts-ignore
    const filePicker = new window.Box.FilePicker();

    filePicker.addListener('choose', async (items: BoxFile[]) => {
      try {
        const file = items[0];
        const sizeError = lessThan40MB(file.size);

        if (sizeError) {
          throw new Error(sizeError);
        }

        if (!file.is_download_available || !onPick) {
          throw new Error("File can't be used.");
        }

        const res = await Axios.get(file.authenticated_download_url, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        onPick(new File([res.data], file.name));
      } catch (error) {
        onError && onError(error.message);
      }
    });
    filePicker.addListener('cancel', () => {
      onCancel && onCancel();
    });

    filePicker.show('0', accessToken, {
      maxSelectable: 1,
      extentions,
      canUpload: false,
      canSetShareAccess: false,
      canCreateNewFolder: false,
      container: '.boxPickerModal__picker',
    });

    return filePicker;
  };
}

export default new BoxContentPickerApi();
