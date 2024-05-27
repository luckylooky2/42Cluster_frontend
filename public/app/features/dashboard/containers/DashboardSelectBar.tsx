import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Divider, useStyles2, Icon } from '@grafana/ui';
import DefaultButton from 'app/core/components/GitHubStyle/Button/DefaultButton';
import { useGrafana } from 'app/core/context/GrafanaContext';

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
  const { chrome } = useGrafana();
  const state = chrome.useState();

  if (state.kioskMode) {
    return;
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.dashboard}>
          <DashboardSelect />
          <OptionSelect showSubMenu={showSubMenu} dashboard={dashboard} ariaLabel={ariaLabel} />
        </div>
        <div className={styles.kiosk}>
          <DefaultButton onClick={chrome.onToggleKioskMode} type="green">
            <Icon name="presentation-play" />
            <span>Kiosk mode</span>
          </DefaultButton>
        </div>
      </div>
      <Divider spacing={1} />
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    bar: css({
      display: 'flex',
      // justifyContent: 'space-between',
    }),
    dashboard: css({
      display: 'flex',
      flexGrow: '2',
    }),
    kiosk: css({
      display: 'flex',
      flexGrow: '1',
      justifyContent: 'flex-end',
    }),
  };
};

export default DashboardSelectBar;
