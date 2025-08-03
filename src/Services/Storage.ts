const LocalStorage = window.localStorage;
const SessionStorage = window.sessionStorage;

const ACCESS_TOKEN_NAME = 'accessToken';
const REDIRECT_ROUTER_PATH = 'redirectRouterPath';

class StorageService {
  getItem = key => {
    const item = LocalStorage.getItem(key);
    return item;
  };
  setItem = (key: string, value) => {
    LocalStorage.setItem(key, value.toString());
  };
  removeItem = (key: string) => {
    LocalStorage.removeItem(key);
  };

  removeAccessToken = () => {
    LocalStorage.removeItem(ACCESS_TOKEN_NAME);
    SessionStorage.removeItem(ACCESS_TOKEN_NAME);
  };

  setAccessToken = value => {
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

  setRedirectRoutePath = (value: string) => {
    SessionStorage.setItem(REDIRECT_ROUTER_PATH, value);
  };

  getRedirectRoutePath = () => {
    return SessionStorage.getItem(REDIRECT_ROUTER_PATH);
  };

  removeRedirectRoutePath = () => {
    SessionStorage.removeItem(REDIRECT_ROUTER_PATH);
  };
}

export default new StorageService();
