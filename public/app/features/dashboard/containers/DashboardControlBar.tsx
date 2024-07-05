import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
// import { locationService } from '@grafana/runtime';
import { Divider, useStyles2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';

import { SubMenu } from '../components/SubMenu/SubMenu';
import { DashboardModel } from '../state';
import { UrlModule } from '../utils/42cluster/urlModule';
import { isTimeRangeChanged, isTemplateVariableFiltered } from '../utils/42cluster/utils';
// import { useTemplateVariable } from '../utils/useTemplateVariable';

import DashboardSelect from './DashboardSelect';
import DashboardUtilityButton from './DashboardUtilityButton';
import OptionSelectedChips from './OptionSelectedChips';

interface Props {
  showSubMenu: boolean;
  dashboard: DashboardModel;
  ariaLabel: string;
}

const DashboardControlBar = ({ showSubMenu, dashboard, ariaLabel }: Props) => {
  const styles = useStyles2(getStyles);
  const { chrome } = useGrafana();
  const state = chrome.useState();

  if (state.kioskMode) {
    return;
  }

  const OptionSelect = ({ showSubMenu, dashboard, ariaLabel }: Props) => {
    return showSubMenu ? (
      <section aria-label={ariaLabel}>
        <SubMenu dashboard={dashboard} annotations={dashboard.annotations.list} links={dashboard.links} />
      </section>
    ) : null;
  };

  const DashboardControls = () => {
    return (
      <div className={styles.controls}>
        <DashboardSelect />
        <OptionSelect showSubMenu={showSubMenu} dashboard={dashboard} ariaLabel={ariaLabel} />
      </div>
    );
  };

  const UtilityControls = () => {
    // const [variable, selectedValues] = useTemplateVariable();

    // const restorePath = (variable: TypedVariableModel, selectedValues: VariableOption[]) => {
    //   const uid = getDashboardUidFromUrl();
    //   const restoredTimeRange = 'from=now-1h&to=now';

    //   // 템플릿 변수가 없는 경우
    //   if (!variable) {

    //     return `/d/${uid}/?${restoredTimeRange}`;
    //   }
    //   // 템플릿 변수가 있는 경우
    //   return `/d/${uid}/${selectedValuesQueryString(selectedValues, variable.id)}&${restoredTimeRange}`;
    // };

    return (
      <div className={styles.controls}>
        {(isTimeRangeChanged() || isTemplateVariableFiltered()) && (
          <DashboardUtilityButton
            title="Reset"
            icon="sync"
            onClick={() =>
              new UrlModule()
                .updateParam('from', 'now-1h')
                .updateParam('to', 'now')
                .deleteAllParam('var-Filters')
                .navigate()
            }
          />
        )}
        <DashboardUtilityButton title="Kiosk Mode" icon="presentation-play" onClick={chrome.onToggleKioskMode} />
      </div>
    );
  };

  return (
    <>
      <div className={styles.bar}>
        <DashboardControls />
        <UtilityControls />
      </div>
      <OptionSelectedChips />
      <Divider spacing={1} />
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    bar: css({
      display: 'flex',
      justifyContent: 'space-between',
    }),
    controls: css({
      display: 'flex',
    }),
  };
};

export default DashboardControlBar;
