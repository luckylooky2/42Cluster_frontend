import { locationService } from '@grafana/runtime';

export class UrlModule {
  pathname: string;
  search: string;

  constructor(pathname = window.location.pathname, search = window.location.search) {
    this.pathname = pathname;
    this.search = search;
  }

  addParam(key: string, value: string): UrlModule {
    const delimeter = this.search ? '&' : '?';
    this.search = this.search + delimeter + `${key}=${value}`;
    return this;
  }

  deleteParam(key: string): UrlModule {
    const params = this.getParams();
    const newParams = [];
    let flag = false;

    // excludes first occurence only
    for (const [k, v] of params) {
      if (!flag && k === key) {
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

  deleteAllParam(key: string): UrlModule {
    const params = this.getParams();
    const newParams = [];

    // excludes all
    for (const [k, v] of params) {
      if (k === key) {
        continue;
      }
      newParams.push([k, v]);
    }

    this.search = '?' + `${newParams.map(([k, v]) => (!v ? k : [k, v].join('='))).join('&')}`;
    return this;
  }

  updateParam(key: string, value: string): UrlModule {
    const params = this.getParams();
    const newParams = [];
    let flag = false;

    for (const [k, v] of params) {
      if (k === key) {
        newParams.push([k, value]);
        flag = true;
        continue;
      }
      newParams.push([k, v]);
    }

    // add if param not defined
    if (!flag) {
      newParams.push([key, value]);
    }

    this.search = '?' + `${newParams.map(([k, v]) => (!v ? k : [k, v].join('='))).join('&')}`;
    return this;
  }

  navigate(): void {
    locationService.push(this.pathname + this.search);
  }

  getUrl(): string {
    return this.pathname + this.search;
  }

  getParams(): string[][] {
    return this.search
      .split(/[?&]/)
      .filter((v) => v !== '')
      .map((v) => v.split('='));
  }
}
