import {
  APIRequestContext,
  APIResponse,
  request,
} from '@playwright/test';

export type APIRequestOptions = Parameters<APIRequestContext['fetch']>[1];
export type APIClientOptions = Parameters<typeof request.newContext>[0];

export class API {
  private client?: APIRequestContext;

  public constructor(private readonly options: APIClientOptions = {}) {}

  public async start(): Promise<this> {
    if (!this.client) {
      this.client = await request.newContext(this.options);
    }

    return this;
  }

  public async request(
    url: string,
    options: APIRequestOptions = {},
  ): Promise<APIResponse> {
    return this.client!.fetch(url, options);
  }

  public async get(url: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    return this.client!.get(url, options);
  }

  public async post(url: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    return this.client!.post(url, options);
  }

  public async put(url: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    return this.client!.put(url, options);
  }

  public async patch(url: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    return this.client!.patch(url, options);
  }

  public async delete(url: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    return this.client!.delete(url, options);
  }

  public async json<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }

  public async expectOk(response: APIResponse): Promise<APIResponse> {
    if (!response.ok()) {
      throw new Error(
        `API request failed with status ${response.status()}: ${response.statusText()}`,
      );
    }

    return response;
  }

  public async close(): Promise<void> {
    await this.client?.dispose();
    this.client = undefined;
  }
}