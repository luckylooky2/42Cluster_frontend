import { css } from '@emotion/css';
import { DOMAttributes } from '@react-types/shared';
import React, { forwardRef } from 'react';
import { useLocation } from 'react-router-dom';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { CustomScrollbar, useStyles2, Stack } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { t } from 'app/core/internationalization';
import { useDashboardList } from 'app/features/browse-dashboards/state';
import { DashboardViewItem } from 'app/features/search/types';
import { useSelector } from 'app/types';

import { MegaMenuItem } from './MegaMenuItem';
import { enrichWithInteractionTracking, getActiveItem } from './utils';

export const MENU_WIDTH = '300px';

export interface Props extends DOMAttributes {
  onClose: () => void;
}

const addPriority = (menuName: string) => {
  switch (menuName) {
    case 'Home':
      return 1;
    case 'Dashboards':
      return 2;
    case 'Logs':
      return 3;
    case 'Vulnerability':
      return 4;
    case 'Deployment':
      return 5;
    case 'Administration':
      return 6;
    default:
      return 9;
  }
};

export const MegaMenu = React.memo(
  forwardRef<HTMLDivElement, Props>(({ onClose, ...restProps }, ref) => {
    const navTree = useSelector((state) => state.navBarTree);
    const styles = useStyles2(getStyles);
    const location = useLocation();
    const { chrome } = useGrafana();
    const state = chrome.useState();
    const dashboardList = useDashboardList();

    const determinePath = function (navItem: NavModelItem, dashboardList: DashboardViewItem[] | undefined) {
      if (navItem.id === 'dashboards/browse') {
        if (dashboardList === undefined) {
          return 'dashboards/not-found';
        } else {
          if (dashboardList.length > 0) {
            return `d/${dashboardList[0].uid}`;
          } else {
            return 'dashboards/not-found';
          }
        }
      } else {
        return navItem.url;
      }
    };

    // Remove profile + help from tree
    const excludedMenu = ['home', 'alerting', 'profile', 'help', 'explore', 'connections', 'starred'];
    const navItems = navTree
      .map((navItem) => ({
        ...navItem,
        priority: addPriority(navItem.text),
        url: determinePath(navItem, dashboardList),
      }))
      .sort((a, b) => a.priority - b.priority)
      .filter((item) => !excludedMenu.includes(item.id as string))
      .map((item) => enrichWithInteractionTracking(item, state.megaMenuDocked));

    const activeItem = getActiveItem(navItems, location.pathname);

    // const handleDockedMenu = () => {
    //   chrome.setMegaMenuDocked(!state.megaMenuDocked);
    //   if (state.megaMenuDocked) {
    //     chrome.setMegaMenuOpen(false);
    //   }

    //   // refocus on undock/menu open button when changing state
    //   setTimeout(() => {
    //     document.getElementById(state.megaMenuDocked ? 'mega-menu-toggle' : 'dock-menu-button')?.focus();
    //   });
    // };

    return (
      <div data-testid={selectors.components.NavMenu.Menu} ref={ref} {...restProps}>
        {/* <div className={styles.mobileHeader}>
          <Icon name="bars" size="xl" />
          <IconButton
            tooltip={t('navigation.megamenu.close', 'Close menu')}
            name="times"
            onClick={onClose}
            size="xl"
            variant="secondary"
          />
        </div> */}
        <nav className={styles.content}>
          <CustomScrollbar hideHorizontalTrack>
            <ul className={styles.itemList} aria-label={t('navigation.megamenu.list-label', 'Navigation')}>
              {navItems.map((link, index) => (
                <Stack key={link.text} direction={index === 0 ? 'row-reverse' : 'row'} alignItems="center">
                  {/* {index === 0 && (
                    <IconButton
                      id="dock-menu-button"
                      className={styles.dockMenuButton}
                      tooltip={
                        state.megaMenuDocked
                          ? t('navigation.megamenu.undock', 'Undock menu')
                          : t('navigation.megamenu.dock', 'Dock menu')
                      }
                      name="web-section-alt"
                      onClick={handleDockedMenu}
                      variant="secondary"
                    />
                  )} */}
                  <MegaMenuItem
                    link={link}
                    onClick={state.megaMenuDocked ? undefined : onClose}
                    activeItem={activeItem}
                  />
                </Stack>
              ))}
            </ul>
          </CustomScrollbar>
        </nav>
      </div>
    );
  })
);

MegaMenu.displayName = 'MegaMenu';

const getStyles = (theme: GrafanaTheme2) => ({
  content: css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    position: 'relative',
    padding: '0 var(--base-size-16, 16px)',
  }),
  mobileHeader: css({
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1, 1, 2),
    borderBottom: `1px solid ${theme.colors.border.weak}`,

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }),
  itemList: css({
    boxSizing: 'border-box',
    display: 'flex',
    gap: theme.spacing(1),
    flexDirection: 'row',
    listStyleType: 'none',
    // padding: theme.spacing(1, 1, 2, 1),
    [theme.breakpoints.up('md')]: {
      // width: MENU_WIDTH,
    },
  }),
  dockMenuButton: css({
    display: 'none',

    [theme.breakpoints.up('xl')]: {
      display: 'inline-flex',
    },
  }),
});
