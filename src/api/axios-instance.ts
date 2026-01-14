import axios, { type AxiosRequestConfig } from 'axios';

/**
 * Custom axios instance that uses VITE_API_BASE_URL from environment
 * and includes withCredentials: true by default
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axios({
    ...config,
    ...options,
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    cancelToken: source.token
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
