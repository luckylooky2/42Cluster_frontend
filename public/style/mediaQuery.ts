import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const mediaQueryStyles = (theme: GrafanaTheme2) => ({
  hideBelowSmall: css({
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),

  hideBelowMedium: css({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }),
});
