import { css } from '@emotion/css';
import React from 'react';

import { PageLayoutType, GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import DefaultButton from 'app/core/components/GitHubStyle/Button/DefaultButton';

import { Page } from '../../core/components/Page/Page';

const Deployment = () => {
  const styles = useStyles2(getStyles);

  return (
    <Page navId="home" layout={PageLayoutType.Canvas} pageNav={{ text: 'Deployment' }}>
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.topBar}>
            <div>
              <DefaultButton text="button1" />
            </div>
            <div>
              <DefaultButton text="button2" type="green" />
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
});

export default Deployment;
