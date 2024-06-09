import { css, cx } from '@emotion/css';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GitHubHoverStyles } from 'style/GitHubHoverStyles';

import { SelectableValue, GrafanaTheme2, locationUtil, textUtil } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { useStyles2 } from '@grafana/ui';
import { config } from 'app/core/config';
// import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
import { contextSrv } from 'app/core/services/context_srv';
import { getUserOrganizations, setUserOrganization } from 'app/features/org/state/actions';
import { useDispatch, useSelector, UserOrg } from 'app/types';

import { Branding } from '../../Branding/Branding';

// import { OrganizationPicker } from './OrganizationPicker';
import { OrganizationSelect } from './OrganizationSelect';

export function NavigateControls() {
  const styles = useStyles2(getStyles);
  const gitHubHoverStyles = useStyles2(GitHubHoverStyles);
  // const theme = useTheme2();
  const dispatch = useDispatch();
  const location = useLocation();
  const orgs = useSelector((state) => state.organization.userOrgs);
  const onSelectChange = (option: SelectableValue<UserOrg>) => {
    if (option.value) {
      setUserOrganization(option.value.orgId);
      locationService.push(`/?orgId=${option.value.orgId}`);
      // TODO how to reload the current page
      window.location.reload();
    }
  };

  let homeUrl = config.appSubUrl || '/';
  if (!config.bootData.user.isSignedIn && !config.anonymousEnabled) {
    homeUrl = textUtil.sanitizeUrl(locationUtil.getUrlForPartial(location, { forceLogin: 'true' }));
  }

  useEffect(() => {
    if (contextSrv.isSignedIn) {
      dispatch(getUserOrganizations());
    }
  }, [dispatch]);

  // const breakpoint = theme.breakpoints.values.sm;

  // const [isSmallScreen, setIsSmallScreen] = useState(!window.matchMedia(`(min-width: ${breakpoint}px)`).matches);

  // useMediaQueryChange({
  //   breakpoint,
  //   onChange: (e) => {
  //     setIsSmallScreen(!e.matches);
  //   },
  // });

  // if (orgs?.length <= 1) {
  //   return null;
  // }

  // const Switcher = isSmallScreen ? OrganizationPicker : OrganizationSelect;

  return (
    <>
      <a className={styles.logo} href={homeUrl} title="Go to home">
        <Branding.MenuLogo className={styles.img} />
      </a>
      <div className={styles.path}>
        <div className={styles.navigateHome}>
          <a className={styles.logo} href={homeUrl} title="Go to home">
            <div className={cx(styles.serviceName, gitHubHoverStyles.default)}>42Cluster</div>
          </a>
          <div className={styles.slash}>/</div>
        </div>
        <OrganizationSelect orgs={orgs} onSelectChange={onSelectChange} />
      </div>
    </>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  slash: css({
    padding: theme.spacing(0.5, 0, 0.5, 0),
    color: '#777',
  }),
  img: css({
    height: theme.spacing(3),
    width: theme.spacing(3),
  }),
  logo: css({
    display: 'flex',
    gap: theme.spacing(1.5),
  }),
  serviceName: css({
    color: theme.isDark ? '#ccc' : '#333',
    width: '100%',
    minWidth: '50px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0.5, 1, 0.5, 1),
  }),
  path: css({
    display: 'flex',
  }),
  navigateHome: css({
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),
});
