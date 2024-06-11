import { TypedVariableModel, VariableOption } from '@grafana/data';
import { getVariablesState } from 'app/features/variables/state/selectors';
import { useSelector, StoreState } from 'app/types';

import { getDashboardUidFromUrl } from './42cluster';

export const useTemplateVariable = (): [TypedVariableModel, VariableOption[]] => {
  const result = useSelector((state: StoreState) => getVariablesState(getDashboardUidFromUrl()));
  const variable = result.variables.namespace;
  const selectedValues = result.optionsPicker.selectedValues;

  return [variable, selectedValues];
};
