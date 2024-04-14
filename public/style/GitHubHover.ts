import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const GitHubHoverStyles = (theme: GrafanaTheme2) => ({
  default: css({
    '&:hover, &:focus-visible': {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: '0.375rem',
      padding: theme.spacing(0.5, 1, 0.5, 1),
    },
  }),
});
