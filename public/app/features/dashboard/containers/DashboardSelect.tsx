import { css, cx } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton, Icon } from '@grafana/ui';
import { useDashboardList } from 'app/features/browse-dashboards/state';

import { GitHubButtonStyles } from '../../../../style/GitHubButtonStyles';
import { getDashboardUidFromUrl } from '../utils/42cluster';

const DashboardSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  const dashboardList = useDashboardList();
  console.log(dashboardList);
  const isValid = dashboardList !== undefined;
  const currDashboard =
    isValid && dashboardList.length ? dashboardList.filter((v) => v.uid === getDashboardUidFromUrl())[0].title : '';

  const createActions = isValid
    ? dashboardList.map((dashboard) => ({
        id: dashboard.uid,
        text: dashboard.title,
        icon: 'plus',
        url: dashboard.url,
        hideFromTabs: true,
        isCreateAction: true,
      }))
    : [];

  //   useEffect(() => {
  //     if (backendState.dashboards.length) {
  //       setCurrDashboard(backendState.dashboards[0].namespace);
  //     }
  //   }, [backendState.dashboards]);

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
            onClick={() => {
              //   const target = e.target as HTMLButtonElement;
              reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
              //   setCurrDashboard(target.textContent === null ? '' : target.textContent);
            }}
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
          className={cx(gitHubButtonStyles.button, gitHubButtonStyles.basicButton, styles.button)}
          aria-label="New"
        >
          <div className={styles.ellipsis}>
            <div>
              <Icon name="horizontal-align-left" />
            </div>
            <div className={styles.text}>{currDashboard}</div>
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
  button: css({ maxWidth: '200px' }),
  text: css({
    paddingLeft: '10px',
  }),
});

export default DashboardSelect;
