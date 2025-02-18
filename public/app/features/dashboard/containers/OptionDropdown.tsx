import { css, cx } from '@emotion/css';
import React, { useEffect, useState } from 'react';
import { mediaQueryStyles } from 'style/mediaQuery';

import { GrafanaTheme2 } from '@grafana/data';
import { VariableOption, VariableWithMultiSupport, VariableWithOptions } from '@grafana/data/src/types/templateVars';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton, Icon } from '@grafana/ui';
import { useAppNotification } from 'app/core/copy/appNotification';
import { useDashboardList } from 'app/features/browse-dashboards/state';
import { OptionsPickerState } from 'app/features/variables/pickers/OptionsPicker/reducer';

import { GitHubButtonStyles } from '../../../../style/GitHubButtonStyles';

interface Props {
  variable: VariableWithMultiSupport | VariableWithOptions;
  picker: OptionsPickerState;
  toggleOption: (option: VariableOption, clearOthers: boolean) => void;
  showOptions: () => void;
}

const OptionDropdown = ({ variable, picker, toggleOption, showOptions }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  const mqstyles = useStyles2(mediaQueryStyles);
  const dashboardList = useDashboardList();
  const notifyApp = useAppNotification();

  console.log(variable, picker);

  if (!variable || dashboardList === undefined) {
    return;
  }

  const isMulti = variable.multi;
  const uid = variable.rootStateKey;

  // variable이 undefined가 되는 경우가 있는가? 그렇지 않다면 return 위로 올리자
  useEffect(() => {
    if (isMulti) {
      showOptions();
    }
  }, [showOptions, isMulti]);

  const handleToggle = (option: VariableOption) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // 1개 이하라면 토글하지 않기
    if (picker.selectedValues.length === 1 && option.value === picker.selectedValues[0].value) {
      notifyApp.error('Please select at least 1 option');
      return;
    }

    const clearOthers = event.shiftKey || event.ctrlKey || event.metaKey;
    toggleOption(option, clearOthers);
  };

  const handleNavigate = (createAction: any) => () => {
    reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
  };

  const createActions = variable.options.map((option, index) => ({
    id: index,
    text: option.text as string, // can't be string[] due to disabled multi-select
    icon: 'plus',
    url: `/d/${uid}/?var-${variable.id}=${option.text}`,
    hideFromTabs: true,
    isCreateAction: true,
    option: option,
  }));

  // 2. 현재 체크된 것 가져오기
  const isChecked = (selectedValues: VariableOption[], title: string) => {
    for (const value of selectedValues) {
      if (value.text === title) {
        return true;
      }
    }
    return false;
  };

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
                ? isChecked(picker.selectedValues, createAction.text)
                : createAction.text === variable.options.find((v) => v.selected === true)?.text
            }
            onClick={isMulti ? handleToggle(createAction.option) : handleNavigate(createAction)}
          />
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={MenuActions} placement="bottom-start" onVisibleChange={setIsOpen}>
      <ToolbarButton
        isOpen={isOpen}
        className={cx(gitHubButtonStyles.button, gitHubButtonStyles.basicButton)}
        aria-label="New"
      >
        <div className={styles.ellipsis}>
          <div>
            <Icon name="filter" />
          </div>
          <div className={css(styles.text, mqstyles.hideBelowMedium)}>
            {isMulti && variable.id}
            {!isMulti && variable.options.filter((v) => v.selected === true)[0]?.value}
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
  // button: css({ maxWidth: '200px' }),
  text: css({
    paddingLeft: '10px',
  }),
});

export default OptionDropdown;
