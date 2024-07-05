import { TypedVariableModel, VariableOption } from '@grafana/data';
import { getVariablesState } from 'app/features/variables/state/selectors';
import { useSelector, StoreState } from 'app/types';

import { getDashboardUidFromUrl } from './42cluster/utils';

export const useTemplateVariable = (uid: string = getDashboardUidFromUrl()): [TypedVariableModel, VariableOption[]] => {
  const result = useSelector((state: StoreState) => getVariablesState(uid));
  const selectedValues = result.optionsPicker.selectedValues;
  const id = result.optionsPicker.id;
  // variable 한 개만 사용한다고 가정
  const variable = result.variables[id];

  return [variable, selectedValues];
};
