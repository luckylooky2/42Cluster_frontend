import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton } from '@grafana/ui';
// import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
// import { useSelector } from 'app/types';

import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';

// import { findCreateActions } from './utils';

export interface Props {}

export const QuickAdd = ({}: Props) => {
  const styles = useStyles2(getStyles);
  // const theme = useTheme2();
  // const navBarTree = useSelector((state) => state.navBarTree);
  // const breakpoint = theme.breakpoints.values.md;

  const [isOpen, setIsOpen] = useState(false);
  // const [isSmallScreen, setIsSmallScreen] = useState(!window.matchMedia(`(min-width: ${breakpoint}px)`).matches);
  // const createActions = useMemo(() => findCreateActions(navBarTree), [navBarTree]);

  const createActions = [
    {
      id: 'dashboards/new',
      text: 'New dashboard',
      icon: 'plus',
      url: '/dashboard/new',
      hideFromTabs: true,
      isCreateAction: true,
    },
    {
      id: 'dashboards/import',
      text: 'Import dashboard',
      subTitle: 'Import dashboard from file or Grafana.com',
      icon: 'plus',
      url: '/dashboard/import',
      hideFromTabs: true,
      isCreateAction: true,
    },
    {
      id: 'alert',
      text: 'Create alert rule',
      subTitle: 'Create an alert rule',
      icon: 'plus',
      url: '/alerting/new',
      hideFromTabs: true,
      isCreateAction: true,
    },
  ];

  // useMediaQueryChange({
  //   breakpoint,
  //   onChange: (e) => {
  //     setIsSmallScreen(!e.matches);
  //   },
  // });

  const MenuActions = () => {
    return (
      <Menu>
        {createActions.map((createAction, index) => (
          <Menu.Item
            key={index}
            url={createAction.url}
            label={createAction.text}
            onClick={() => reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' })}
          />
        ))}
      </Menu>
    );
  };

  return (
    <>
      <Dropdown overlay={MenuActions} placement="bottom-end" onVisibleChange={setIsOpen}>
        <ToolbarButton iconOnly icon="plus" isOpen={isOpen} className={styles.quickAddHover} aria-label="New" />
      </Dropdown>
      <NavToolbarSeparator className={styles.separator} />
    </>
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

  quickAddHover: css({
    border: '1px solid',
    borderColor: theme.colors.border.strong,
    borderRadius: '0.375rem',

    '&:focus, &:focus-visible': {
      outline: 'none',
      boxShadow: 'none',
      transition: 'none',
    },
    '&:focus:not(:focus-visible)': {
      outline: 'none',
      boxShadow: `none`,
    },
    '&:hover': {
      boxShadow: 'none',
      borderColor: theme.colors.text.disabled,
      background: 'none',
    },
  }),
  separator: css({
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),

  header: css({
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    padding: theme.spacing(0.5, 1),
    whiteSpace: 'nowrap',
  }),
  subTitle: css({
    color: theme.colors.text.secondary,
    fontSize: theme.typography.bodySmall.fontSize,
  }),
});
