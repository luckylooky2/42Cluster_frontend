import { UrlModule } from './urlModule';

export const getDashboardUidFromUrl = function () {
  const [DEV, PROD] = [2, 3];

  return window.location.pathname.split('/')[DEV];
};

export const ROOT = 0;
export const DASHBOARD = 1;
export const LOGIN = 2;

export const determineUrl = function (index: number) {
  const [DEV, PROD] = [0, 1];

  const url = [
    ['/', '/d/', '/login'],
    ['/grafana', '/grafana/d/', '/grafana/login'],
  ];

  return url[DEV][index];
};

// TODO : /var-namespace=All
// 1) 미리 모든 variable을 받아와서 링크 구성하기
// - 불가능 : getVariablesState를 호출해도 해당 대시보드의 variable을 받아올 수 없음(현재 대시보드만 가능한 것으로 관측)
// 2) includeAll = true로 만들고, 내부적으로 selectedValues에 모두 체크되도록 실행하기

export const isTimeRangeChanged = () => {
  const params = new UrlModule().getParams();
  if (params) {
    let [isFromChanged, isToChanged] = [false, false];

    // 변수화 필요
    for (const [key, value] of params) {
      if (key === 'from' && value !== 'now-1h') {
        isFromChanged = true;
      }
      if (key === 'to' && value !== 'now') {
        isToChanged = true;
      }
    }

    return isFromChanged || isToChanged ? true : false;
  }

  return false;
};

export const isTemplateVariableFiltered = () => {
  const params = new UrlModule().getParams();
  if (params) {
    const keys = params.map((v) => v[0]);
    if (!keys.includes('var-Filters')) {
      return false;
    }
    return true;
  }

  return false;
};
