import { TypedVariableModel } from "../../../../../packages/grafana-data/src";
import { OptionsPickerState } from "app/features/variables/pickers/OptionsPicker/reducer";

export const getDashboardUidFromUrl = function () {
  const DEV = 2,
    PROD = 3;

  return window.location.pathname.split('/')[DEV];
};

export const createRenderList = function (variable : TypedVariableModel, picker: OptionsPickerState) : string[] {
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

  return renderList.sort();
}


export const getTemplateVariableName = function (title: string | null) {
  switch (title) {
    default:
      return 'namespace';
  }
};