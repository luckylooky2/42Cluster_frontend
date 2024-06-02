import React from 'react';

import { getVariablesState } from 'app/features/variables/state/selectors';

import { getDashboardUidFromUrl } from '../utils/42cluster';

const OptionSelectedChips = () => {
  const result = getVariablesState(getDashboardUidFromUrl());
  const variable = result.variables.namespace;
  const picker = result.optionsPicker;
  const renderList: string[] = [];

  if (Array.isArray(variable.current.value)) {
    for (const value of variable.current.value) {
      renderList.push(value);
    }
  } else {
    renderList.push(variable.current.value);
  }

  for (const elem of picker.selectedValues) {
    const value = elem.value as string;
    let isDuplicated = false;

    for (const elem of renderList) {
      if (elem === value) {
        isDuplicated = true;
        break;
      }
    }
    if (!isDuplicated) {
      renderList.push(value);
    }
  }

  console.log(variable, picker);
  console.log(renderList);

  return <div>{variable.multi && renderList.map((v, i) => <div key={`${v} ${i}`}>{v}</div>)}</div>;
};

export default OptionSelectedChips;
