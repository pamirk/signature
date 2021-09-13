import { HttpStatus } from 'Interfaces/HttpStatusEnum';

const LocalStorage = window.localStorage;
const SessionStorage = window.sessionStorage;

const ACCESS_TOKEN_NAME = 'accessToken';

class StorageService {
  getItem = (key: string) => {
    const item = LocalStorage.getItem(key);
    return item;
  };
  setItem = (key: string, value:any) => {
    LocalStorage.setItem(key, value.toString());
  };
  removeItem = (key: string) => {
    LocalStorage.removeItem(key);
  };

  removeAccessToken = () => {
    LocalStorage.removeItem(ACCESS_TOKEN_NAME);
    SessionStorage.removeItem(ACCESS_TOKEN_NAME);
  };

  setAccessToken = (value:any) => {
    LocalStorage.setItem(ACCESS_TOKEN_NAME, value.toString());
    SessionStorage.setItem(ACCESS_TOKEN_NAME, value.toString());
  };

  getAccessToken = () => {
    const localAccessToken = LocalStorage.getItem(ACCESS_TOKEN_NAME);
    const sessionAccessToken = SessionStorage.getItem(ACCESS_TOKEN_NAME);

    if (localAccessToken && !sessionAccessToken) {
      SessionStorage.setItem(ACCESS_TOKEN_NAME, localAccessToken);

      return localAccessToken;
    }

    if (!localAccessToken || localAccessToken !== sessionAccessToken) return undefined;

    return localAccessToken;
  };
}

export default new StorageService();
