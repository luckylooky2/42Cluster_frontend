import { css } from '@emotion/css';
import React from 'react';

import { PageLayoutType, GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { customButtonColor } from '../../core/color/color';
import { Page } from '../../core/components/Page/Page';

const Deployment = () => {
  const styles = useStyles2(getStyles);

  return (
    <Page navId="home" layout={PageLayoutType.Canvas} pageNav={{ text: 'Deployment' }}>
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.topBar}>
            <div>
              <button className={`${styles.button} ${styles.basicButton}`}>button1</button>
            </div>
            <div>
              <button className={`${styles.button} ${styles.greenButton}`}>button2</button>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a elementum mi. Interdum et malesuada fames
          ac ante ipsum primis in faucibus. Donec eleifend ante ipsum, vel aliquam lectus placerat a. Suspendisse
          facilisis ligula nec efficitur rhoncus. Ut aliquet odio sed velit commodo vestibulum. Quisque eget purus vitae
          nibh sodales tincidunt eget iaculis elit. Pellentesque scelerisque ornare volutpat. Interdum et malesuada
          fames ac ante ipsum primis in faucibus. Integer dapibus justo massa, non porttitor erat varius nec. Proin
          turpis metus, luctus eget odio vel, varius scelerisque odio. Aenean mollis lacinia ex sit amet euismod. In
          consectetur accumsan lectus at placerat. Nulla tincidunt neque at augue venenatis, eu semper dui tincidunt.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla porttitor
          arcu non dolor mollis, vulputate porttitor dolor porta. Fusce massa lectus, tincidunt eu faucibus quis,
          scelerisque sed mauris.
        </div>
      </div>
    </Page>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  layout: css({
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '24px',
    gridTemplateColumns: 'minmax(0, calc(100% - 296px - 24px)) 0 auto',
  }),
  left: css({
    gridColumn: '1',
  }),
  right: css({
    gridColumn: '2/span 2',
    backgroundColor: theme.colors.background.secondary,
    width: '296px',
  }),
  topBar: css({
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    paddingTop: '8px',
  }),
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

export default Deployment;
