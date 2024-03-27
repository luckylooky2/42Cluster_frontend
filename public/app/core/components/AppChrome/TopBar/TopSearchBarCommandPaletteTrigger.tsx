import { css, cx } from '@emotion/css';
import { useKBar, VisualState } from 'kbar';
import React, { useMemo, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { getInputStyles, Icon, ToolbarButton, useStyles2, useTheme2 } from '@grafana/ui';
import { focusCss } from '@grafana/ui/src/themes/mixins';
import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
import { t } from 'app/core/internationalization';
import { getModKey } from 'app/core/utils/browser';

export function TopSearchBarCommandPaletteTrigger() {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const { query: kbar } = useKBar((kbarState) => ({
    kbarSearchQuery: kbarState.searchQuery,
    kbarIsOpen: kbarState.visualState === VisualState.showing,
  }));

  const breakpoint = theme.breakpoints.values.md;

  const [isSmallScreen, setIsSmallScreen] = useState(!window.matchMedia(`(min-width: ${breakpoint}px)`).matches);

  useMediaQueryChange({
    breakpoint,
    onChange: (e) => {
      setIsSmallScreen(!e.matches);
    },
  });

  const onOpenSearch = () => {
    kbar.toggle();
  };

  if (isSmallScreen) {
    return (
      <ToolbarButton
        iconOnly
        icon="search"
        aria-label={t('nav.search.placeholderCommandPalette', 'Search or jump to...')}
        className={styles.searchBarHover}
        onClick={onOpenSearch}
      />
    );
  }

  return <PretendTextInput onClick={onOpenSearch} />;
}

interface PretendTextInputProps {
  onClick: () => void;
}

function PretendTextInput({ onClick }: PretendTextInputProps) {
  const styles = useStyles2(getStyles);
  const modKey = useMemo(() => getModKey(), []);

  // We want the desktop command palette trigger to look like a search box,
  // but it actually behaves like a button - you active it and it performs an
  // action. You don't actually type into it.

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <div className={styles.prefix}>
          <Icon name="search" />
        </div>

        <button className={styles.fakeInput} onClick={onClick}>
          {t('nav.search.placeholderCommandPalette', 'Search or jump to...')}
        </button>

        <div className={styles.suffix}>
          <Icon name="keyboard" />
          <span className={styles.shortcut}>{modKey}+k</span>
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  const baseStyles = getInputStyles({ theme });

  return {
    wrapper: cx(
      css({
        label: 'input-wrapper',
        display: 'flex',
        width: '100%',
        maxWidth: '400px',
        height: theme.spacing(theme.components.height.md),
        borderRadius: theme.shape.radius.default,
      })
    ),
    inputWrapper: baseStyles.inputWrapper,
    prefix: baseStyles.prefix,
    suffix: css([
      baseStyles.suffix,
      {
        display: 'flex',
        gap: theme.spacing(0.5),
      },
    ]),
    shortcut: css({
      fontSize: theme.typography.bodySmall.fontSize,
    }),
    // TODO : z-index와 hover 고려해야 함
    fakeInput: css([
      baseStyles.input,
      {
        textAlign: 'left',
        paddingLeft: 28,
        color: theme.colors.text.disabled,
        borderColor: theme.colors.border.strong,
        borderRadius: '0.375rem',

        // We want the focus styles to appear only when tabbing through, not when clicking the button
        // (and when focus is restored after command palette closes)
        '&:focus': {
          outline: 'unset',
          boxShadow: 'unset',
        },

        '&:hover': {
          boxShadow: 'none',
          borderColor: theme.colors.text.disabled,
          background: 'none',
        },

        '&:focus-visible': css`
          ${focusCss(theme)}
        `,
      },
    ]),

    button: css({
      // height: 32,
      width: '100%',
      textAlign: 'center',

      '> *': {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        gap: '1ch',
      },
    }),

    searchBarHover: css({
      border: '1px solid',
      borderColor: theme.colors.border.strong,
      borderRadius: '0.375rem',

      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        transition: 'none',
      },
      '&:focus:not(:focus-visible)': {
        outline: 'none',
        boxShadow: `none`,
      },
      '&:hover': {
        boxShadow: 'none',
        borderColor: theme.colors.text.disabled,
        background: 'none',
      },
    }),
  };
};
