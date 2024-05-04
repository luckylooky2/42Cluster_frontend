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
        <span className={styles.button}>{}</span>
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
    width: '58px',
    height: '28px',
    background: '#fff',
    border: '2px solid #daa',
    borderRadius: '20px',
    transition: '0.2s',

    '&:hover': {
      background: '#efefef',
    },
  }),
  switch: css({
    position: 'absolute',
    appearance: 'none',

    '&:checked + label': {
      background: '#c44',
      border: '2px solid #c44',
    },

    '&:checked + label:hover': {
      background: '#e55',
    },

    '&:checked + label span': {
      left: '33px',
      background: '#fff',
      boxShadow: '1px 2px 3px #00000020',
    },
  }),
  button: css({
    position: 'absolute',
    top: '3px',
    left: '5px',
    display: 'inline-block',
    width: '19px',
    height: '19px',
    borderRadius: '20px',
    background: '#daa',
    transition: '0.2s',
  }),
});

export default DarkModeToggle;
