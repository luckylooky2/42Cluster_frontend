import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { SubMenu } from '../components/SubMenu/SubMenu';
import { DashboardModel } from '../state';

import DashboardSelect from './DashboardSelect';

interface Props {
  showSubMenu: boolean;
  dashboard: DashboardModel;
  ariaLabel: string;
}

const OptionSelect = ({ showSubMenu, dashboard, ariaLabel }: Props) => {
  return showSubMenu ? (
    <section aria-label={ariaLabel}>
      <SubMenu dashboard={dashboard} annotations={dashboard.annotations.list} links={dashboard.links} />
    </section>
  ) : null;
};

const DashboardSelectBar = ({ showSubMenu, dashboard, ariaLabel }: Props) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.selectBar}>
      <DashboardSelect />
      <OptionSelect showSubMenu={showSubMenu} dashboard={dashboard} ariaLabel={ariaLabel} />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    selectBar: css({
      display: 'flex',
      // justifyContent: 'space-between',
    }),
  };
};

export default DashboardSelectBar;
