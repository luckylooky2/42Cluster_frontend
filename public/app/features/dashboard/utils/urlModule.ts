import { locationService } from '@grafana/runtime';

export class UrlModule {
  url: string;

  constructor(url = window.location.pathname + window.location.search) {
    this.url = url;
  }

  addParam(key: any, value: any) {
    const delimeter = window.location.search ? '&' : '?';
    this.url = this.url + delimeter + `${String(key)}=${String(value)}`;
    return this;
  }

  deleteParam(key: any) {
    const baseUrl = window.location.pathname;
    const params = window.location.search
      .split(/[?&]/)
      .filter((v) => v !== '')
      .map((v) => v.split('='));
    const newParams = [];
    let flag = false;

    // excludes first occurence only
    for (const [k, v] of params) {
      if (!flag && k === String(key)) {
        flag = true;
        continue;
      }
      newParams.push([k, v]);
    }

    this.url = baseUrl + '?' + `${newParams.map((v) => v.join('=')).join('&')}`;
    return this;
  }

  deleteAllParam(key: any) {
    const baseUrl = window.location.pathname;
    const params = window.location.search
      .split(/[?&]/)
      .filter((v) => v !== '')
      .map((v) => v.split('='));
    const newParams = [];

    // excludes all
    for (const [k, v] of params) {
      if (k === String(key)) {
        continue;
      }
      newParams.push([k, v]);
    }

    this.url = baseUrl + '?' + `${newParams.map((v) => v.join('=')).join('&')}`;
    return this;
  }

  updateParam(key: any, value: any) {
    const baseUrl = window.location.pathname;
    const params = window.location.search
      .split(/[?&]/)
      .filter((v) => v !== '')
      .map((v) => v.split('='));

    for (let i = 0; i < params.length; i++) {
      const curr = params[i];
      if (curr[0] === String(key)) {
        curr[1] = String(value);
      }
    }

    this.url = baseUrl + '?' + `${params.map((v) => v.join('=')).join('&')}`;
    return this;
  }

  navigate() {
    locationService.push(this.url);
  }

  getUrl() {
    return this.url;
  }
}
