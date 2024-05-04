import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { changeTheme } from 'app/core/services/theme';

import { config } from '../../../../core/config';

const DarkModeToggle = () => {
  const styles = useStyles2(getStyles);
  const [isDark, setIsDark] = useState(config.theme2.isDark);

  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        id="switch"
        className={styles.switch}
        checked={isDark}
        onChange={() => {
          changeTheme(isDark ? 'light' : 'dark');
          setIsDark(!isDark);
        }}
      />
      <label htmlFor="switch" className={styles.switchLabel}>
        {isDark && <img className={styles.dark} src="public/img/42Cluster/moon.png" alt="dark" />}
        <span className={styles.button}>{}</span>
        {!isDark && <img className={styles.light} src="public/img/42Cluster/sun.png" alt="light" />}
      </label>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css({ position: 'relative', display: 'flex' }),
  switchLabel: css({
    position: 'relative',
    cursor: 'pointer',
    display: 'inline-block',
    width: '60px',
    height: '30px',
    background: '#fff',
    border: '1px solid',
    borderColor: theme.colors.border.strong,
    borderRadius: '20px',
    transition: '0.2s',
  }),
  switch: css({
    position: 'absolute',
    appearance: 'none',

    '&:checked + label': {
      background: '#39ace7',
      border: '1px solid #39ace7',
    },

    '&:checked + label span': {
      left: '33px',
      background: '#fff',
    },
  }),
  button: css({
    position: 'absolute',
    top: '3px',
    left: '5px',
    display: 'inline-block',
    width: '22px',
    height: '22px',
    borderRadius: '20px',
    background: theme.colors.border.strong,
    transition: '0.2s',
  }),
  light: css({
    position: 'absolute',
    top: '6px',
    left: '35px',
    display: 'inline-block',
    filter: 'invert(20%)',
    width: '15px',
    height: '15px',
    zIndex: '10',
  }),
  dark: css({
    position: 'absolute',
    top: '7px',
    left: '10px',
    display: 'inline-block',
    filter: 'invert(100%)',
    width: '15px',
    height: '15px',
    zIndex: '10',
  }),
});

export default DarkModeToggle;
