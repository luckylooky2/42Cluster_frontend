import { css, cx } from '@emotion/css';
import React, { useState } from 'react';
import { mediaQueryStyles } from 'style/mediaQuery';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton, Icon } from '@grafana/ui';
import { useDashboardList } from 'app/features/browse-dashboards/state';

import { GitHubButtonStyles } from '../../../../style/GitHubButtonStyles';
import { getDashboardUidFromUrl } from '../utils/42cluster/utils';

const DashboardSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  const mqstyles = useStyles2(mediaQueryStyles);
  const uid: string | undefined = getDashboardUidFromUrl();
  const dashboardList = useDashboardList()?.filter((v) => v.uid.startsWith(uid?.[0]));

  if (dashboardList === undefined) {
    return;
  }

  const currDashboard = dashboardList.find((v) => v.uid === uid);

  const handleNavigate = (createAction: any) => () => {
    //   const target = e.target as HTMLButtonElement;
    reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
    //   setCurrDashboard(target.textContent === null ? '' : target.textContent);
  };

  // 모든 대시보드의 variable 상황을 한 꺼번에 받아올 수 없기 때문에 여기서 Link 경로를 지정하는 것에 무리가 있음
  // - 해당 대시보드가 로드되고 난 이후에 변경하는 방향으로
  const createActions = dashboardList.map((dashboard) => ({
    id: dashboard.uid,
    text: dashboard.title,
    icon: 'plus',
    url: `/d/${dashboard.uid}`,
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
            disabled={currDashboard?.title === createAction.text}
            checkType={true}
            isChecked={currDashboard?.title === createAction.text}
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
            <div className={cx(styles.text, mqstyles.hideBelowSmall)}>{currDashboard?.title}</div>
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
