import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

import { customButtonColor } from './color';

export const GitHubButtonStyles = (theme: GrafanaTheme2) => ({
  button: css({
    fontFamily: 'inherit',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    appearance: 'none',
    userSelect: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px',
    // minWidth: max-content,
    // box-shadow: var(--button-default-shadow-resting, var(--color-btn-shadow, 0 0 transparent)), var(--button-default-shadow-inset, var(--color-btn-inset-shadow, 0 0 transparent)),
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderImage: 'initial',
    textDecoration: 'none',
    padding: '0px 12px',
    gap: '8px',
    transition: 'color 80ms cubic-bezier(0.65, 0, 0.35, 1) 0s, fill, background-color, border-color',
  }),
  basicButton: css({
    color: theme.isDark ? customButtonColor.dark.default.color : customButtonColor.light.default.color,
    backgroundColor: theme.isDark
      ? customButtonColor.dark.default.basic.background
      : customButtonColor.light.default.basic.background,
    borderColor: theme.isDark
      ? customButtonColor.dark.default.basic.borderColor
      : customButtonColor.light.default.basic.borderColor,

    '&:hover': {
      borderColor: theme.isDark
        ? customButtonColor.dark.default.hover.borderColor
        : customButtonColor.light.default.hover.borderColor,
      backgroundColor: theme.isDark
        ? customButtonColor.dark.default.hover.background
        : customButtonColor.light.default.hover.background,
    },
  }),
  greenButton: css({
    color: theme.isDark ? customButtonColor.dark.green.color : customButtonColor.light.green.color,
    backgroundColor: theme.isDark
      ? customButtonColor.dark.green.basic.background
      : customButtonColor.light.green.basic.background,
    borderColor: theme.isDark
      ? customButtonColor.dark.green.basic.borderColor
      : customButtonColor.light.green.basic.borderColor,

    '&:hover': {
      borderColor: theme.isDark
        ? customButtonColor.dark.green.hover.borderColor
        : customButtonColor.light.green.hover.borderColor,
      backgroundColor: theme.isDark
        ? customButtonColor.dark.green.hover.background
        : customButtonColor.light.green.hover.background,
    },
  }),
});
