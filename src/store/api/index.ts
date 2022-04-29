import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { BASE_API_URL, URL } from '@/config/constants';

const client: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

export default async function ajax(requestConfig: AxiosRequestConfig): Promise<any> {
  try {
    return await client(requestConfig);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const baseApi = {
  getTokenSingleLogo(address: string): Promise<AxiosResponse<string>> {
    return ajax({
      method: 'get',
      url: URL.tokenSingleLogo(address),
    });
  },
  getTokenAllLogos(addresses: string[]): Promise<AxiosResponse<string[]>> {
    return ajax({
      method: 'post',
      url: URL.tokenAllLogos,
      data: {
        addresses,
      },
    });
  },
  getPriceBot() {
    return ajax({
      method: 'get',
      url: URL.priceBot,
    });
  },
};
