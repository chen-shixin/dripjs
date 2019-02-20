import Axios, { AxiosRequestConfig } from 'axios';
import { HttpMethod } from 'dripjs-types';
import { stringify } from 'qs';

import { getRestAuthHeaders } from '../common';
import { Config, RestResponse, restApiBasePath, restEndpoints } from '../types';

export class Rest {
  constructor(private readonly config: Config) {}

  protected async request(method: HttpMethod, endpoint: string, data: any): Promise<RestResponse> {
    const authHeaders = getRestAuthHeaders(method, endpoint, this.config.apiKey, this.config.apiSecret, data);
    const request: AxiosRequestConfig = {
      method,
      headers: {
        ...authHeaders,
      },
    };
    let query = '';
    if (method !== HttpMethod.GET) {
      request.data = data;
    } else {
      query = Object.keys(data).length !== 0 ? `?${stringify(data)}` : '';
    }
    const baseUrl = this.config.testnet ? restEndpoints.testnet : restEndpoints.production;
    const url = `${baseUrl}${restApiBasePath}${endpoint}${query}`;
    const response = await Axios(url, request);

    return {
      headers: response.headers,
      body: response.data,
    };
  }
}
