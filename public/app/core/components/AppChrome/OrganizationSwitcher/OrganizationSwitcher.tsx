import { css } from '@emotion/css';
import React, { useEffect } from 'react';

import { SelectableValue, GrafanaTheme2 } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { useStyles2 } from '@grafana/ui';
// import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
import { contextSrv } from 'app/core/services/context_srv';
import { getUserOrganizations, setUserOrganization } from 'app/features/org/state/actions';
import { useDispatch, useSelector, UserOrg } from 'app/types';

// import { OrganizationPicker } from './OrganizationPicker';
import { OrganizationSelect } from './OrganizationSelect';

export function OrganizationSwitcher() {
  const styles = useStyles2(getStyles);
  // const theme = useTheme2();
  const dispatch = useDispatch();
  const orgs = useSelector((state) => state.organization.userOrgs);
  const onSelectChange = (option: SelectableValue<UserOrg>) => {
    if (option.value) {
      setUserOrganization(option.value.orgId);
      locationService.push(`/?orgId=${option.value.orgId}`);
      // TODO how to reload the current page
      window.location.reload();
    }
  };
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
      <div className={styles.slash}>/</div>
      <OrganizationSelect orgs={orgs} onSelectChange={onSelectChange} />
    </>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  slash: css({
    padding: theme.spacing(0.5, 0, 0.5, 0),
    color: '#777',
  }),
});
