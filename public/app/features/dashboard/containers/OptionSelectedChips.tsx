import { css } from '@emotion/css';
import React from 'react';
import { StoreState, useSelector } from 'app/types';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { getState } from 'app/store/store';
import { useDispatch } from 'app/types';
import { getVariablesState } from 'app/features/variables/state/selectors';
import { commitChangesToVariable } from 'app/features/variables/pickers/OptionsPicker/actions';
import {  toggleOption } from 'app/features/variables/pickers/OptionsPicker/reducer';
import { toKeyedAction } from 'app/features/variables/state/keyedVariablesReducer';

import { getDashboardUidFromUrl } from '../utils/42cluster';
import { customButtonColor } from '../../../../style/color';

const OptionSelectedChips = () => {
  const uid = getDashboardUidFromUrl();
  // should make variable result a state
  const result = useSelector((state : StoreState) => getVariablesState(uid));
  const dispatch = useDispatch();
  const variable = result.variables.namespace;
  const picker = result.optionsPicker;
  const renderList: string[] = picker.selectedValues.map((v) => v.value).sort();
  const styles = useStyles2(getStyles);

  if (!variable || !variable.multi) {
    return;
  }

  const onRemoveFromRenderList = (e) => {
    const value = e.target.getAttribute('data-value');
    const option = picker.selectedValues.filter((v) => v.value === value)[0];

    if (picker.selectedValues.length === 1) {
      // TODO : 알림 띄우기
      return ;
    }
    dispatch(toKeyedAction(uid, toggleOption({ option, clearOthers : false, forceSelect: false }))); // 이거는 토글만 한 것이고 variable에 반영을 해야 함
    commitChangesToVariable(uid)(dispatch, getState);
  }

  return <div className={styles.chipWrapper}>
    {renderList.map((v, i) => 
    <div key={`${v} ${i}`} className={styles.chip}>
      {v}
      <span data-value={v} className={styles.closeButton} onClick={onRemoveFromRenderList}>&times;</span>
    </div>)}
    </div>;
};

const getStyles = (theme: GrafanaTheme2) => ({
  chipWrapper: css({
    display: 'flex',
  }),
  chip: css({
    display: 'flex',
    marginRight: '10px',
    padding: '0px 15px',
    borderRadius: '1em',
    // display: 'inline-block',
    fontSize: '16px',
    height: '30px',
    lineHeight: '30px',
    backgroundColor: theme.isDark ? customButtonColor.dark.default.basic.background : customButtonColor.light.default.basic.background,
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
    }
  })
});


export default OptionSelectedChips;
