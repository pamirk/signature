import axios from 'axios';
import StorageService from 'Services/Storage';
import { API_URL } from 'Utils/constants';

export default async (accessToken, optHeaders = {}) => {
  let token = accessToken;
  const workflowReferer = window.location.href;
  const headers: Record<string, string> = {
    ...optHeaders,
    workflow_referer: workflowReferer,
  };

  // fallback to JWT for old users
  if (!token) {
    token = StorageService.getAccessToken();
  }

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return axios.create({
    headers,
    withCredentials: true,
    baseURL: API_URL,
  });
};
