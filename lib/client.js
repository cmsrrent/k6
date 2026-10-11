import http from 'k6/http';
import { env } from '../config/environments.js';

// Thin wrapper over k6/http: base URL, JSON handling and auth header.
// Pass `tags: { name: '...' }` per call so URLs with ids don't explode metric series.
export class ApiClient {
  constructor(baseUrl = env.baseUrl, token = env.token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  _params(params = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(params.headers || {}),
    };
    return { ...params, headers };
  }

  _body(body) {
    return body === undefined || body === null ? null : JSON.stringify(body);
  }

  get(path, params) {
    return http.get(`${this.baseUrl}${path}`, this._params(params));
  }

  post(path, body, params) {
    return http.post(`${this.baseUrl}${path}`, this._body(body), this._params(params));
  }

  put(path, body, params) {
    return http.put(`${this.baseUrl}${path}`, this._body(body), this._params(params));
  }

  patch(path, body, params) {
    return http.patch(`${this.baseUrl}${path}`, this._body(body), this._params(params));
  }

  del(path, params) {
    return http.del(`${this.baseUrl}${path}`, null, this._params(params));
  }
}
