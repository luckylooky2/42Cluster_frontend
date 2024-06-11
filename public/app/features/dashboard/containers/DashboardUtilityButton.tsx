import { css, cx } from '@emotion/css';
import React from 'react';
import { mediaQueryStyles } from 'style/mediaQuery';

import { IconName, GrafanaTheme2 } from '@grafana/data';
import { Icon, useStyles2 } from '@grafana/ui';
import DefaultButton from 'app/core/components/GitHubStyle/Button/DefaultButton';

interface Props {
  title: string;
  icon: IconName;
  onClick: () => void;
}

const DashboardUtilityButton = ({ title, icon, onClick }: Props) => {
  const styles = useStyles2(getStyles);
  const mqStyles = useStyles2(mediaQueryStyles);

  return (
    <div className={cx(styles.utilityButton, styles.gap)}>
      <DefaultButton onClick={onClick}>
        <Icon name={`${icon}`} />
        <span className={mqStyles.hideBelowMedium}>{title}</span>
      </DefaultButton>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    utilityButton: css({
      display: 'flex',
    }),
    gap: css({ margin: '0px 0px 10px 8px' }),
  };
};

export default DashboardUtilityButton;
