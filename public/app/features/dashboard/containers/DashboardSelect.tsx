import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton } from '@grafana/ui';
import { useSelector } from 'app/types';

import { customButtonColor } from '../../../core/color/color';

const DashboardSelect = () => {
  const backendState = useSelector((state) => state.fourtyTwoClusterBackend);
  const [isOpen, setIsOpen] = useState(false);
  const styles = useStyles2(getStyles);
  const currDashboard = backendState.dashboards.length
    ? backendState.dashboards.filter((v) => v.uid === window.location.pathname.split('/')[2])[0].namespace
    : '';

  const createActions = backendState.dashboards.map((dashboard) => ({
    id: dashboard.uid,
    text: dashboard.namespace,
    icon: 'plus',
    url: dashboard.url,
    hideFromTabs: true,
    isCreateAction: true,
  }));

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
        <ToolbarButton isOpen={isOpen} className={`${styles.button} ${styles.basicButton}`} aria-label="New">
          <div className={styles.ellipsis}>{currDashboard}</div>
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
  select: css({ margin: '0px 8px 10px 16px' }),
  ellipsis: css({ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
  button: css({
    maxWidth: '150px',
    fontFamily: 'inherit',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    appearance: 'none',
    userSelect: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px',
    // minWidth: max-content,
    // box-shadow: var(--button-default-shadow-resting, var(--color-btn-shadow, 0 0 transparent)), var(--button-default-shadow-inset, var(--color-btn-inset-shadow, 0 0 transparent)),
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderImage: 'initial',
    textDecoration: 'none',
    padding: '0px 12px',
    gap: '8px',
    transition: 'color 80ms cubic-bezier(0.65, 0, 0.35, 1) 0s, fill, background-color, border-color',
  }),
  basicButton: css({
    color: theme.isDark ? customButtonColor.dark.default.color : customButtonColor.light.default.color,
    backgroundColor: theme.isDark
      ? customButtonColor.dark.default.basic.background
      : customButtonColor.light.default.basic.background,
    borderColor: theme.isDark
      ? customButtonColor.dark.default.basic.borderColor
      : customButtonColor.light.default.basic.borderColor,

    '&:hover': {
      borderColor: theme.isDark
        ? customButtonColor.dark.default.hover.borderColor
        : customButtonColor.light.default.hover.borderColor,
      backgroundColor: theme.isDark
        ? customButtonColor.dark.default.hover.background
        : customButtonColor.light.default.hover.background,
    },
  }),
});

export default DashboardSelect;
