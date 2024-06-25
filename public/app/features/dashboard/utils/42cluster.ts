import { getVariablesState } from 'app/features/variables/state/selectors';

import { VariableOption } from '../../../../../packages/grafana-data/src';

export const getDashboardUidFromUrl = function () {
  const DEV = 2,
    PROD = 3;

  return window.location.pathname.split('/')[DEV];
};

export const determineUrl = function () {
  const DEV = 0,
    PROD = 1;

  const url = [
    ['/d/', '/login'],
    ['/grafana/d/', '/grafana/login'],
  ];

  return url[DEV];
};

// TODO : /var-namespace=All
// 1) 미리 모든 variable을 받아와서 링크 구성하기
// - 불가능 : getVariablesState를 호출해도 해당 대시보드의 variable을 받아올 수 없음(현재 대시보드만 가능한 것으로 관측)
// 2) includeAll = true로 만들고, 내부적으로 selectedValues에 모두 체크되도록 실행하기

// 사용되지 않음
export const variableQueryString = (uid: string) => {
  const result = getVariablesState(uid);
  const variable = result.variables.namespace;
  const prefix = '?';

  if (variable === undefined || !variable.multi) {
    return '';
  }

  return prefix + variable.options.map((v: VariableOption) => `var-${variable.id}=${v.value}`).join('&');
};

export const selectedValuesQueryString = (selectedValues: VariableOption[], variableId: string) => {
  const prefix = '?';

  if (selectedValues === undefined || selectedValues.length === 0) {
    return '';
  }

  return prefix + selectedValues.map((v: VariableOption) => `var-${variableId}=${v.value}`).join('&');
};
