import React, { ComponentType, PureComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { LoadingState } from '@grafana/data';
import { ClickOutsideWrapper } from '@grafana/ui';
// import { notifyApp } from 'app/core/actions';
// import { createErrorNotification } from 'app/core/copy/appNotification';
import OptionDropdown from 'app/features/dashboard/containers/OptionDropdown';
import { StoreState, ThunkDispatch, AppNotification } from 'app/types';

// import { VARIABLE_PREFIX } from '../../constants';
import { isMulti } from '../../guard';
import { getVariableQueryRunner } from '../../query/VariableQueryRunner';
// import { formatVariableLabel } from '../../shared/formatVariable';
import { toKeyedAction } from '../../state/keyedVariablesReducer';
import { getVariablesState } from '../../state/selectors';
import { KeyedVariableIdentifier } from '../../state/types';
import { VariableOption, VariableWithMultiSupport, VariableWithOptions } from '../../types';
import { toKeyedVariableIdentifier } from '../../utils';
// import { VariableInput } from '../shared/VariableInput';
// import { VariableLink } from '../shared/VariableLink';
// import VariableOptions from '../shared/VariableOptions';
import { NavigationKey, VariablePickerProps } from '../types';

import { commitChangesToVariable, filterOrSearchOptions, navigateOptions, openOptions } from './actions';
import { initialOptionPickerState, toggleAllOptions, toggleOption } from './reducer';

export const optionPickerFactory = <Model extends VariableWithOptions | VariableWithMultiSupport>(): ComponentType<
  VariablePickerProps<Model>
> => {
  // Redux thunk를 사용한 코드
  // - mapDispatchToProps가 내부적으로 액션 객체를 처리하는 thunk 함수들로 이루어진 객체를 반환하는 함수이다
  // - dispatch를 원하는 시점에 할 수 있기 때문에 1) 추가 매개변수가 필요하거나 2) 비동기 작업 3) 추가 로직을 처리할 수 있다
  // - 각각의 함수 안에서 dispatch를 반드시 호출해야 store에 반영이 된다
  const mapDispatchToProps = (dispatch: ThunkDispatch) => {
    return {
      ...bindActionCreators({ openOptions, commitChangesToVariable, navigateOptions }, dispatch),
      filterOrSearchOptions: (identifier: KeyedVariableIdentifier, filter = '') => {
        dispatch(filterOrSearchOptions(identifier, filter));
      },
      toggleAllOptions: (identifier: KeyedVariableIdentifier) =>
        dispatch(toKeyedAction(identifier.rootStateKey, toggleAllOptions())),
      toggleOption: (
        identifier: KeyedVariableIdentifier,
        option: VariableOption,
        clearOthers: boolean,
        forceSelect: boolean
      ) => dispatch(toKeyedAction(identifier.rootStateKey, toggleOption({ option, clearOthers, forceSelect }))),
      // notifyApp: (notification: AppNotification) => dispatch(notifyApp(notification)),
    };
  };

  const mapStateToProps = (state: StoreState, ownProps: OwnProps) => {
    const { rootStateKey } = ownProps.variable;
    if (!rootStateKey) {
      console.error('OptionPickerFactory: variable has no rootStateKey');
      return {
        picker: initialOptionPickerState,
      };
    }

    return {
      picker: getVariablesState(rootStateKey, state).optionsPicker,
    };
  };

  const connector = connect(mapStateToProps, mapDispatchToProps);

  interface OwnProps extends VariablePickerProps<Model> {}

  type Props = OwnProps & ConnectedProps<typeof connector>;

  class OptionsPickerUnconnected extends PureComponent<Props> {
    onShowOptions = () =>
      this.props.openOptions(toKeyedVariableIdentifier(this.props.variable), this.props.onVariableChange);

    onHideOptions = () => {
      if (!this.props.variable.rootStateKey) {
        console.error('Variable has no rootStateKey');
        return;
      }

      // 두 리스트가 같다면 적용하지 않는다
      let variableList = [];
      let pickerList = [];
      const variable = this.props.variable.current.value;
      const picker = this.props.picker.selectedValues;

      if (Array.isArray(variable)) {
        for (const elem of variable) {
          variableList.push(elem);
        }
      } else {
        variableList.push(variable);
      }

      for (const elem of picker) {
        pickerList.push(elem.value);
      }

      variableList = variableList.sort();
      pickerList = pickerList.sort();

      if (variableList.length === pickerList.length) {
        let count = 0;
        for (let i = 0; i < variableList.length; i++) {
          if (variableList[i] === pickerList[i]) {
            count++;
          }
        }

        if (count === variableList.length) {
          return;
        }
      }

      this.props.commitChangesToVariable(this.props.variable.rootStateKey, this.props.onVariableChange);
    };

    onToggleOption = (option: VariableOption, clearOthers: boolean) => {
      const toggleFunc =
        isMulti(this.props.variable) && this.props.variable.multi
          ? this.onToggleMultiValueVariable
          : this.onToggleSingleValueVariable;
      toggleFunc(option, clearOthers);
    };

    onToggleSingleValueVariable = (option: VariableOption, clearOthers: boolean) => {
      this.props.toggleOption(toKeyedVariableIdentifier(this.props.variable), option, clearOthers, false);
      this.onHideOptions();
    };

    onToggleMultiValueVariable = (option: VariableOption, clearOthers: boolean) => {
      this.props.toggleOption(toKeyedVariableIdentifier(this.props.variable), option, clearOthers, false);
    };

    onToggleAllOptions = () => {
      this.props.toggleAllOptions(toKeyedVariableIdentifier(this.props.variable));
    };

    onFilterOrSearchOptions = (filter: string) => {
      this.props.filterOrSearchOptions(toKeyedVariableIdentifier(this.props.variable), filter);
    };

    onNavigate = (key: NavigationKey, clearOthers: boolean) => {
      if (!this.props.variable.rootStateKey) {
        console.error('Variable has no rootStateKey');
        return;
      }

      this.props.navigateOptions(this.props.variable.rootStateKey, key, clearOthers);
    };

    render() {
      const { variable, picker } = this.props;
      // const showOptions = picker.id === variable.id; // true: dropdown 열림(picker), false: dropdown 닫힘(variable)

      return (
        <div className="variable-link-wrapper">
          <ClickOutsideWrapper onClick={variable.multi ? this.onHideOptions : () => {}}>
            <OptionDropdown
              variable={variable}
              picker={picker}
              toggleOption={this.onToggleOption}
              showOptions={this.onShowOptions}
            />
          </ClickOutsideWrapper>
          {/* {showOptions ? this.renderOptions(picker) : this.renderLink(variable)} */}
        </div>
      );
    }

    // renderLink(variable: VariableWithOptions) {
    //   const linkText = formatVariableLabel(variable);
    //   const loading = variable.state === LoadingState.Loading;

    //   return (
    //     <VariableLink
    //       id={VARIABLE_PREFIX + variable.id}
    //       text={linkText}
    //       onClick={this.onShowOptions}
    //       loading={loading}
    //       onCancel={this.onCancel}
    //       disabled={this.props.readOnly}
    //     />
    //   );
    // }

    onCancel = () => {
      getVariableQueryRunner().cancelRequest(toKeyedVariableIdentifier(this.props.variable));
    };

    // renderOptions(picker: OptionsPickerState) {
    //   const { id } = this.props.variable;
    //   return (
    //     <ClickOutsideWrapper onClick={this.onHideOptions}>
    //       <VariableInput
    //         id={VARIABLE_PREFIX + id}
    //         value={picker.queryValue}
    //         onChange={this.onFilterOrSearchOptions}
    //         onNavigate={this.onNavigate}
    //         aria-expanded={true}
    //         aria-controls={`options-${id}`}
    //       />
    //       <VariableOptions
    //         values={picker.options}
    //         onToggle={this.onToggleOption}
    //         onToggleAll={this.onToggleAllOptions}
    //         highlightIndex={picker.highlightIndex}
    //         multi={picker.multi}
    //         selectedValues={picker.selectedValues}
    //         id={`options-${id}`}
    //       />
    //     </ClickOutsideWrapper>
    //   );
    // }
  }

  const OptionsPicker = connector(OptionsPickerUnconnected);
  OptionsPicker.displayName = 'OptionsPicker';

  return OptionsPicker;
};
