import axios, { AxiosRequestConfig } from 'axios';
import { UploadStatuses } from 'Interfaces/Common';

export interface FilePutPayload {
  url: string;
  file: File;
  options?: AxiosRequestConfig;
}

class AWS {
  putFile = async ({ url, file, options }: FilePutPayload) => {
    try {
      return await axios.put(url, file, {
        ...options,
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        return { status: UploadStatuses.CANCELLED };
      }

      throw typeof error === 'string' ? new Error(error) : error;
    }
  };
}

export default new AWS();
