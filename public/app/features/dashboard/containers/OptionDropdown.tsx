import { css, cx } from '@emotion/css';
import React, { useEffect, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { VariableOption, VariableWithMultiSupport, VariableWithOptions } from '@grafana/data/src/types/templateVars';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton, Icon } from '@grafana/ui';
import { useDashboardList } from 'app/features/browse-dashboards/state';
import { OptionsPickerState } from 'app/features/variables/pickers/OptionsPicker/reducer';

import { GitHubButtonStyles } from '../../../../style/GitHubButtonStyles';
import { getDashboardUidFromUrl } from '../utils/42cluster';

interface Props {
  variable: VariableWithMultiSupport | VariableWithOptions;
  picker: OptionsPickerState;
  onToggle: (option: VariableOption, clearOthers: boolean) => void;
  showOptions: () => void;
}

const OptionDropdown = ({ variable, picker, onToggle, showOptions }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  const dashboardList = useDashboardList();
  const isValid = dashboardList !== undefined;
  const isMulti = variable.multi;
  const subCaterogyName = function (title: string | null) {
    switch (title) {
      default:
        return 'namespace';
    }
  };

  const handleOnToggle = (option: VariableOption) => (event: React.MouseEvent<HTMLButtonElement>) => {
    const clearOthers = event.shiftKey || event.ctrlKey || event.metaKey;
    event.preventDefault();
    event.stopPropagation();
    onToggle(option, clearOthers);
  };

  const handleNavigate = (createAction: any) => () => {
    reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
  };

  // 1. 현재 대시보드 uid 가져오기
  const currDashboard =
    isValid && dashboardList.length
      ? dashboardList.filter((v) => v.uid === getDashboardUidFromUrl())[0]
      : { kind: '', uid: '', title: '', url: '' };

  const createActions = variable.options.map((option, index) => ({
    // const createActions = mock.map((option, index) => ({
    id: index,
    text: option.text as string, // can't be string[] due to disabled multi-select
    icon: 'plus',
    url: `/d/${currDashboard.uid}/${currDashboard.title}?var-${subCaterogyName(currDashboard.title)}=${option.text}`,
    hideFromTabs: true,
    isCreateAction: true,
    option: option,
  }));

  // 2. 현재 체크된 것 가져오기
  const check = (selectedValues: VariableOption[], title: string) => {
    for (const value of selectedValues) {
      if (value.text === title) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isMulti) {
      showOptions();
    }
  }, [showOptions, isMulti]);

  const MenuActions = () => {
    return (
      <Menu>
        {createActions.map((createAction, index) => (
          <Menu.Item
            key={index}
            url={isMulti ? undefined : createAction.url}
            label={createAction.text}
            checkType={true}
            isChecked={
              isMulti
                ? check(picker.selectedValues, createAction.text)
                : createAction.text === variable.options.filter((v) => v.selected === true)[0].text
            }
            onClick={isMulti ? handleOnToggle(createAction.option) : handleNavigate(createAction)}
          />
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={MenuActions} placement="bottom-start" onVisibleChange={setIsOpen}>
      <ToolbarButton
        isOpen={isOpen}
        className={cx(gitHubButtonStyles.button, gitHubButtonStyles.greenButton, styles.button)}
        aria-label="New"
      >
        <div className={styles.ellipsis}>
          <div>
            <Icon name="filter" />
          </div>
          <div className={styles.text}>
            {isMulti ? 'multi-select' : variable.options.filter((v) => v.selected === true)[0].text}
          </div>
        </div>
      </ToolbarButton>
    </Dropdown>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  buttonContent: css({
    alignItems: 'center',
    display: 'flex',
  }),
  buttonText: css({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }),
  ellipsis: css({
    display: 'flex',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  button: css({ maxWidth: '200px' }),
  text: css({
    paddingLeft: '10px',
  }),
});

export default OptionDropdown;
