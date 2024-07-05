import { css, cx } from '@emotion/css';
import classNames from 'classnames';
import React, { PropsWithChildren, useEffect } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { useStyles2, LinkButton, useTheme2 } from '@grafana/ui';
import config from 'app/core/config';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
import store from 'app/core/store';
import { useLoadNextChildrenPage } from 'app/features/browse-dashboards/state';
import { CommandPalette } from 'app/features/commandPalette/CommandPalette';
import { determineUrl, DASHBOARD, LOGIN } from 'app/features/dashboard/utils/42cluster/utils';
import { KioskMode } from 'app/types';

import { AppChromeMenu } from './AppChromeMenu';
import { DOCKED_LOCAL_STORAGE_KEY, DOCKED_MENU_OPEN_LOCAL_STORAGE_KEY } from './AppChromeService';
import { MegaMenu } from './MegaMenu/MegaMenu';
// import { NavToolbar } from './NavToolbar/NavToolbar';
import { ReturnToPrevious } from './ReturnToPrevious/ReturnToPrevious';
import { TopSearchBar } from './TopBar/TopSearchBar';
import { TOP_BAR_LEVEL_HEIGHT } from './types';

export interface Props extends PropsWithChildren<{}> {}

export function AppChrome({ children }: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const searchBarHidden = state.searchBarHidden || state.kioskMode === KioskMode.TV;
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const dashboardUrl = determineUrl(DASHBOARD);
  const loginUrl = determineUrl(LOGIN);
  const isDashboardPage = window.location.pathname.startsWith(dashboardUrl);
  const isLogin = window.location.pathname.startsWith(loginUrl);
  // should render when kiosk mode is full while only at dashboard page
  const shouldRenderContent = !isLogin && (!isDashboardPage || (isDashboardPage && !state.kioskMode));
  // not execute in login page
  // for fetching current users's accessible dashboards
  const handleFetchDashboards = useLoadNextChildrenPage();

  if (!isLogin) {
    handleFetchDashboards(undefined);
  }

  const dockedMenuBreakpoint = theme.breakpoints.values.xl;
  const dockedMenuLocalStorageState = store.getBool(DOCKED_LOCAL_STORAGE_KEY, true);
  useMediaQueryChange({
    breakpoint: dockedMenuBreakpoint,
    onChange: (e) => {
      if (dockedMenuLocalStorageState) {
        chrome.setMegaMenuDocked(e.matches, false);
        chrome.setMegaMenuOpen(
          e.matches ? store.getBool(DOCKED_MENU_OPEN_LOCAL_STORAGE_KEY, state.megaMenuOpen) : false
        );
      }
    },
  });

  const contentClass = cx({
    [styles.content]: true,
    [styles.contentNoSearchBar]: searchBarHidden,
    [styles.contentChromeless]: state.chromeless,
  });

  // const handleMegaMenu = () => {
  //   chrome.setMegaMenuOpen(!state.megaMenuOpen);
  // };

  const { pathname, search } = locationService.getLocation();
  const url = pathname + search;
  const shouldShowReturnToPrevious =
    config.featureToggles.returnToPrevious && state.returnToPrevious && url !== state.returnToPrevious.href;

  // Clear returnToPrevious when the page is manually navigated to
  useEffect(() => {
    if (state.returnToPrevious && url === state.returnToPrevious.href) {
      chrome.clearReturnToPrevious('auto_dismissed');
    }
    // We only want to pay attention when the location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome, url]);

  // Chromeless routes are without topNav, mega menu, search & command palette
  // We check chromeless twice here instead of having a separate path so {children}
  // doesn't get re-mounted when chromeless goes from true to false.
  return (
    <div
      className={classNames('main-view', {
        'main-view--search-bar-hidden': searchBarHidden && !state.chromeless,
        'main-view--chrome-hidden': state.chromeless,
      })}
    >
      {shouldRenderContent && (
        <>
          <LinkButton className={styles.skipLink} href="#pageContent">
            Skip to main content
          </LinkButton>
          <div className={cx(styles.topNav)}>
            <TopSearchBar />
            <MegaMenu className={styles.dockedMegaMenu} onClose={() => {}} />
            {/* <NavToolbar
              searchBarHidden={searchBarHidden}
              sectionNav={state.sectionNav.node}
              pageNav={state.pageNav}
              actions={state.actions}
              onToggleSearchBar={chrome.onToggleSearchBar}
              onToggleMegaMenu={handleMegaMenu}
              onToggleKioskMode={chrome.onToggleKioskMode}
            /> */}
          </div>
        </>
      )}
      <main className={contentClass}>
        <div className={styles.panes}>
          <div className={styles.pageContainer} id="pageContent">
            {children}
          </div>
        </div>
      </main>
      {!state.chromeless && <AppChromeMenu />}
      {!state.chromeless && <CommandPalette />}
      {shouldShowReturnToPrevious && state.returnToPrevious && (
        <ReturnToPrevious href={state.returnToPrevious.href} title={state.returnToPrevious.title} />
      )}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    content: css({
      display: 'flex',
      flexDirection: 'column',
      // paddingTop: TOP_BAR_LEVEL_HEIGHT * 3,
      flexGrow: 1,
      height: '100vh',
      alignItems: 'center',
    }),
    contentNoSearchBar: css({
      paddingTop: TOP_BAR_LEVEL_HEIGHT,
    }),
    contentChromeless: css({
      paddingTop: 0,
    }),
    dockedMegaMenu: css({
      background: theme.colors.background.primary,
      borderRight: `1px solid ${theme.colors.border.weak}`,
      display: 'block',
      zIndex: theme.zIndex.navbarFixed,
    }),
    topNav: css({
      display: 'flex',
      // position: 'fixed',
      zIndex: theme.zIndex.navbarFixed,
      left: 0,
      right: 0,
      background: theme.colors.background.primary,
      flexDirection: 'column',
    }),
    panes: css({
      label: 'page-panes',
      display: 'flex',
      height: '100%',
      width: '95%',
      // maxWidth: '1100px',
      flexGrow: 1,
      minHeight: 0,
      flexDirection: 'column',
      // [theme.breakpoints.up('md')]: {
      //   flexDirection: 'row',
      // },
    }),
    pageContainer: css({
      label: 'page-container',
      flexGrow: 1,
      minHeight: 0,
      minWidth: 0,
      // overflow: 'auto',
      '@media print': {
        overflow: 'visible',
      },
      '@page': {
        margin: 0,
        size: 'auto',
        padding: 0,
      },
    }),
    skipLink: css({
      position: 'absolute',
      top: -1000,

      ':focus': {
        left: theme.spacing(1),
        top: theme.spacing(1),
        zIndex: theme.zIndex.portal,
      },
    }),
  };
};
