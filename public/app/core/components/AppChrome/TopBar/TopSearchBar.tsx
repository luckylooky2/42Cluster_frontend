import { css } from '@emotion/css';
// import { cloneDeep } from 'lodash';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Dropdown, ToolbarButton, useStyles2 } from '@grafana/ui';
import { contextSrv } from 'app/core/core';
import { useSelector } from 'app/types';

// import { enrichHelpItem } from '../MegaMenu/utils';
// import { NewsContainer } from '../News/NewsContainer';
import { NavigateControls } from '../OrganizationSwitcher/NavigateControls';
import { QuickAdd } from '../QuickAdd/QuickAdd';
import { TOP_BAR_LEVEL_HEIGHT } from '../types';

import DarkModeToggle from './DarkModeToggle';
import { SignInLink } from './SignInLink';
import { TopNavBarMenu } from './TopNavBarMenu';
// import { TopSearchBarCommandPaletteTrigger } from './TopSearchBarCommandPaletteTrigger';
import { TopSearchBarSection } from './TopSearchBarSection';

export const TopSearchBar = React.memo(function TopSearchBar() {
  const styles = useStyles2(getStyles);
  const navIndex = useSelector((state) => state.navIndex);

  // const helpNode = cloneDeep(navIndex['help']);
  // const enrichedHelpNode = helpNode ? enrichHelpItem(helpNode) : undefined;
  const profileNode = navIndex['profile'];

  return (
    <div className={styles.layout}>
      <TopSearchBarSection gap={false}>
        <NavigateControls />
      </TopSearchBarSection>

      <TopSearchBarSection align="right">
        {/* <TopSearchBarCommandPaletteTrigger /> */}
        <DarkModeToggle />
        {/* <QuickAdd /> */}
        {/* {enrichedHelpNode && (
          <Dropdown overlay={() => <TopNavBarMenu node={enrichedHelpNode} />} placement="bottom-end">
            <ToolbarButton iconOnly icon="question-circle" aria-label="Help" />
          </Dropdown>
        )} */}
        {/* {config.newsFeedEnabled && <NewsContainer />} */}
        {!contextSrv.user.isSignedIn && <SignInLink />}
        {profileNode && (
          <Dropdown overlay={() => <TopNavBarMenu node={profileNode} />} placement="bottom-end">
            <ToolbarButton
              className={styles.profileButton}
              imgSrc={contextSrv.user.gravatarUrl}
              imgAlt="User avatar"
              aria-label="Profile"
            />
          </Dropdown>
        )}
      </TopSearchBarSection>
    </div>
  );
});

const getStyles = (theme: GrafanaTheme2) => ({
  layout: css({
    height: TOP_BAR_LEVEL_HEIGHT,
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    padding: theme.spacing(0, 1, 0, 2),
    margin: theme.spacing(1, 1, 1, 1),
    // borderBottom: `1px solid ${theme.colors.border.weak}`,
    justifyContent: 'space-between',

    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr', // search should not be smaller than 240px
      display: 'grid',

      justifyContent: 'flex-start',
    },
  }),
  profileButton: css({
    padding: theme.spacing(0, 0.25),
    img: {
      borderRadius: theme.shape.radius.circle,
      height: '30px',
      marginRight: 0,
      width: '30px',
    },
  }),
});
