import { locationService } from '@grafana/runtime';

export class UrlModule {
  pathname: string;
  search: string;

  constructor(pathname = window.location.pathname, search = window.location.search) {
    this.pathname = pathname;
    this.search = search;
  }

  addParam(key: any, value: any) {
    const delimeter = this.search ? '&' : '?';
    this.search = this.search + delimeter + `${String(key)}=${String(value)}`;
    return this;
  }

  deleteParam(key: any) {
    const params = this.getParams();
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

    if (newParams.length) {
      this.search = '?' + `${newParams.map(([k, v]) => (!v ? k : [k, v].join('='))).join('&')}`;
    } else {
      this.search = '';
    }
    return this;
  }

  deleteAllParam(key: any) {
    const params = this.getParams();
    const newParams = [];

    // excludes all
    for (const [k, v] of params) {
      if (k === String(key)) {
        continue;
      }
      newParams.push([k, v]);
    }

    this.search = '?' + `${newParams.map(([k, v]) => (!v ? k : [k, v].join('='))).join('&')}`;
    return this;
  }

  updateParam(key: any, value: any) {
    const params = this.getParams();
    const newParams = [];
    let flag = false;

    for (const [k, v] of params) {
      if (k === String(key)) {
        newParams.push([k, value]);
        flag = true;
        continue;
      }
      newParams.push([k, v]);
    }

    // 없으면 추가
    if (!flag) {
      newParams.push([key, value]);
    }

    this.search = '?' + `${newParams.map(([k, v]) => (!v ? k : [k, v].join('='))).join('&')}`;
    return this;
  }

  navigate() {
    locationService.push(this.pathname + this.search);
  }

  getUrl() {
    return this.pathname + this.search;
  }

  getParams() {
    return this.search
      .split(/[?&]/)
      .filter((v) => v !== '')
      .map((v) => v.split('='));
  }
}
