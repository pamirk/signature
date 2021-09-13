// @ts-ignore
import loadScript from 'load-script';
import Axios from 'axios';
import { ONEDRIVE_SDK_URL, ONEDRIVE_APP_ID } from 'Utils/constants';
import { lessThan40MB } from 'Utils/validation';
import { FileDownloadCallback } from './Interfaces';

interface OneDriveResult {
  value: OneDriveFile[];
  webUrl: string | null;
  accessToken: string;
}

interface OneDriveFile {
  '@microsoft.graph.downloadUrl': string;
  'thumbnails@odata.context': string;
  id: string;
  name: string;
  size: number;
  thumbnails: Thumbnails[];
  webUrl: string;
}

interface Thumbnails {
  id: string;
  large: Thumbnail;
  medium: Thumbnail;
  small: Thumbnail;
}

interface Thumbnail {
  height: number;
  width: number;
  url: string;
}

enum ActionTypes {
  DOWNLOAD = 'download',
  SHARE = 'share',
  QUERY = 'query',
}

interface OneDriveOpenOptions {
  clientId: string;
  action: ActionTypes;
  multiSelect: boolean;
  openInNewWindow: boolean;
  accountSwitchEnabled?: boolean;
  advanced?: {
    redirectUri?: string;
    filter?: string;
    endpointHint?: string;
    accessToken?: string;
  };
  success?: (result: OneDriveResult) => void;
  cancel?: () => void;
  error?: (e:any) => void;
}

interface OneDrive {
  open(options: OneDriveOpenOptions):any;
}

interface LaunchOneDrivePickerParams {
  accessToken: string;
  onPick?: FileDownloadCallback;
  extentions?: string[];
}

loadScript(ONEDRIVE_SDK_URL);

class OneDriveApi {
  launchOneDrivePicker = (options: LaunchOneDrivePickerParams) =>
    new Promise((resolve:any, reject) => {
      //@ts-ignore
      const OneDrive: OneDrive = window.OneDrive;

      if (!OneDrive) reject('Api is not loaded yet');

      const { onPick, accessToken, extentions = [] } = options;

      const oneDriveOptions: OneDriveOpenOptions = {
        clientId: ONEDRIVE_APP_ID,
        openInNewWindow: true,
        action: ActionTypes.DOWNLOAD,
        multiSelect: false,
        advanced: {
          redirectUri: window.location.origin,
          filter: ['folder', ...extentions].join(','),
        },
        success: async result => {
          try {
            const fileMeta = result.value[0];
            const sizeError = lessThan40MB(fileMeta.size);

            if (sizeError) {
              throw new Error(sizeError);
            }

            const file: File = await this.downloadFile(fileMeta);

            if (onPick) {
              await onPick(file);
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        },
        cancel: () => resolve(),
        error: () => {
          reject('Failed to pick file.');
        },
      };

      OneDrive.open(oneDriveOptions);
    });

  downloadFile = async (file: OneDriveFile) => {
    const res = await Axios.get(file['@microsoft.graph.downloadUrl'], {
      responseType: 'blob',
    });

    return new File([res.data], file.name);
  };
}

export default new OneDriveApi();
