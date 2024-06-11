import { TypedVariableModel, VariableOption } from '../../../../../packages/grafana-data/src';

export const getDashboardUidFromUrl = function () {
  const DEV = 2,
    PROD = 3;

  return window.location.pathname.split('/')[DEV];
};

export const variableQueryString = (variable: TypedVariableModel, selectedValues: VariableOption[]) => {
  const prefix = '?';
  if (selectedValues.length) {
    return prefix + selectedValues.map((v: VariableOption) => `var-${variable.id}=${v.value}`).join('&');
  }
  return '';
};
