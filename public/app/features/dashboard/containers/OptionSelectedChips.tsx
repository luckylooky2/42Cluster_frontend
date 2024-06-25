import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { useAppNotification } from 'app/core/copy/appNotification';
import { commitChangesToVariable } from 'app/features/variables/pickers/OptionsPicker/actions';
import { toggleOption } from 'app/features/variables/pickers/OptionsPicker/reducer';
import { toKeyedAction } from 'app/features/variables/state/keyedVariablesReducer';
import { getState } from 'app/store/store';
import { useDispatch } from 'app/types';

import { customButtonColor } from '../../../../style/color';
import { getDashboardUidFromUrl } from '../utils/42cluster';
import { useTemplateVariable } from '../utils/useTemplateVariable';

const SELECTED_ALL = '$__all';

const OptionSelectedChips = () => {
  // should make "result" a state variable
  const [variable, selectedValues] = useTemplateVariable();
  const dispatch = useDispatch();
  const styles = useStyles2(getStyles);
  const notifyApp = useAppNotification();

  if (!variable || !variable.multi || selectedValues.length === 0) {
    return;
  }

  const renderList: string[] = (selectedValues[0].value === SELECTED_ALL ? variable.options.slice(1) : selectedValues)
    .map((v) => v.value as string)
    .sort();

  const onRemoveFromRenderList = (e) => {
    const value = e.target.getAttribute('data-value');
    const option = selectedValues.filter((v) => v.value === value)[0];
    const uid = getDashboardUidFromUrl();

    if (selectedValues[0].value === SELECTED_ALL) {
      console.log(selectedValues, variable.options);
      for (const currOption of variable.options) {
        console.log(currOption);
        if (currOption.value === value) {
          continue;
        }
        dispatch(toKeyedAction(uid, toggleOption({ option: currOption, clearOthers: false, forceSelect: false })));
      }
      commitChangesToVariable(uid)(dispatch, getState);
      return;
    }

    if (selectedValues.length === 1) {
      notifyApp.error('Please select at least 1 option');
      return;
    }
    dispatch(toKeyedAction(uid, toggleOption({ option, clearOthers: false, forceSelect: false }))); // 이거는 토글만 한 것이고 variable에 반영을 해야 함
    commitChangesToVariable(uid)(dispatch, getState);
  };

  return (
    <div className={styles.chipWrapper}>
      {renderList.map((v, i) => (
        <div key={`${v} ${i}`} className={styles.chip}>
          {v}
          <span data-value={v} className={styles.closeButton} onClick={onRemoveFromRenderList}>
            &times;
          </span>
        </div>
      ))}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  chipWrapper: css({
    display: 'flex',
    flexWrap: 'wrap', // 자식 요소들이 상위 요소의 너비를 초과하면 다음 줄로 넘김
  }),
  chip: css({
    display: 'flex',
    margin: '5px 10px 0px 0px',
    padding: '0px 15px',
    borderRadius: '1em',
    // display: 'inline-block',
    whiteSpace: 'nowrap', // 텍스트가 줄 바꿈 없이 한 줄로 유지
    fontSize: '16px',
    height: '30px',
    lineHeight: '30px',
    backgroundColor: theme.isDark
      ? customButtonColor.dark.default.basic.background
      : customButtonColor.light.default.basic.background,
  }),
  closeButton: css({
    paddingLeft: '10px',
    color: '#888',
    // fontWeight: 'bold',
    float: 'right',
    fontSize: '20px',
    cursor: 'pointer',

    '&:hover': {
      color: '#c9c9c9',
    },
  }),
});

export default OptionSelectedChips;
