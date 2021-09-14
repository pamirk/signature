import loadScript from 'load-script';
import Axios from 'axios';
import { DROPBOX_SDK_URL, DROPBOX_APP_KEY } from 'Utils/constants';
import { lessThan40MB } from 'Utils/validation';

type FileDownloadCallback = (values: any) => any;
type ErrorCallback = (values: any) => any;

loadScript(DROPBOX_SDK_URL, {
  attrs: {
    id: 'dropboxjs',
    'data-app-key': DROPBOX_APP_KEY,
  },
});

export enum LinkTypes {
  PREVIEW = 'preview',
}

export interface DropboxFile {
  isDir: boolean;
  linkType: LinkTypes;
  name: string;
  thumbnailLink: string;
  bytes: number;
  link: string;
  id: string;
  icon: string;
}

interface PickerParams {
  onPick?: FileDownloadCallback;
  onError?: ErrorCallback;
  extensions?: string[];
}

class DropboxApi {
  openPicker = ({ onPick, onError, extensions = [] }: PickerParams) => {
    //@ts-ignore
    const { Dropbox } = window;

    if (!Dropbox) {
      return onError && onError('Api is not loaded yet');
    }

    return Dropbox.choose({
      success: async (files: DropboxFile[]) => {
        const currFileMeta = files[0];
        const sizeError = lessThan40MB(currFileMeta.bytes);

        if (sizeError) {
          return onError && onError(sizeError);
        }

        const file = await this.downloadFile(files[0]);

        onPick && onPick(file);
      },
      folderselect: false,
      multiselect: false,
      linkType: 'direct',
      sizeLimit: 40 * 10 ** 6,
      extensions,
    });
  };

  downloadFile = async (file: DropboxFile) => {
    const fileBlob = await Axios.get(file.link, { responseType: 'blob' });

    return new File([fileBlob.data], file.name);
  };
}

export default new DropboxApi();
