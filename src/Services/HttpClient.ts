import axios from 'axios';
import StorageService from 'Services/Storage';
import { API_URL } from 'Utils/constants';

export default async (accessToken, optHeaders = {}) => {
  const token = accessToken || (await StorageService.getAccessToken());
  let headers = {};

  if (token) {
    headers = {
      authorization: `Bearer ${token}`,
      ...optHeaders,
    };
  }
  const instance = axios.create({
    headers,
    baseURL: API_URL,
  });
  return instance;
};
