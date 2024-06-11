import { css, cx } from '@emotion/css';
import React, { useState } from 'react';
import { mediaQueryStyles } from 'style/mediaQuery';

import { GrafanaTheme2, TypedVariableModel, VariableOption } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton, Icon } from '@grafana/ui';
import { useDashboardList } from 'app/features/browse-dashboards/state';
import { getVariablesState } from 'app/features/variables/state/selectors';
import { StoreState, useSelector } from 'app/types';

import { GitHubButtonStyles } from '../../../../style/GitHubButtonStyles';
import { getDashboardUidFromUrl } from '../utils/42cluster';

const DashboardSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  const mqstyles = useStyles2(mediaQueryStyles);
  const uid = getDashboardUidFromUrl();
  const dashboardList = useDashboardList();
  const result = useSelector((state: StoreState) => getVariablesState(uid));
  const variable = result.variables.namespace;
  const picker = result.optionsPicker;
  const selectedValues = picker.selectedValues;

  if (dashboardList === undefined) {
    return;
  }

  const currDashboard = dashboardList.filter((v) => v.uid === uid)[0].title;

  const handleNavigate = (createAction: any) => () => {
    //   const target = e.target as HTMLButtonElement;
    reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
    //   setCurrDashboard(target.textContent === null ? '' : target.textContent);
  };

  const variableQueryString = (variable: TypedVariableModel, selectedValues: VariableOption[]) => {
    const prefix = '/?';
    if (selectedValues.length) {
      return prefix + selectedValues.map((v: VariableOption) => `var-${variable.id}=${v.value}`).join('&');
    }
    return '';
  };

  const createActions = dashboardList.map((dashboard) => ({
    id: dashboard.uid,
    text: dashboard.title,
    icon: 'plus',
    url: `${dashboard.url}${variableQueryString(variable, selectedValues)}`,
    hideFromTabs: true,
    isCreateAction: true,
  }));

  const MenuActions = () => {
    return (
      <Menu>
        {createActions.map((createAction, index) => (
          <Menu.Item
            key={index}
            url={createAction.url}
            label={createAction.text}
            checkType={true}
            isChecked={currDashboard === createAction.text}
            onClick={handleNavigate(createAction)}
          />
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={MenuActions} placement="bottom-start" onVisibleChange={setIsOpen}>
      <div className={styles.select}>
        <ToolbarButton
          isOpen={isOpen}
          className={cx(gitHubButtonStyles.button, gitHubButtonStyles.greenButton)}
          aria-label="New"
        >
          <div className={styles.ellipsis}>
            <div>
              <Icon name="horizontal-align-left" />
            </div>
            <div className={cx(styles.text, mqstyles.hideBelowSmall)}>{currDashboard}</div>
          </div>
        </ToolbarButton>
      </div>
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
  select: css({ margin: '0px 8px 10px 0px' }),
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

export default DashboardSelect;
