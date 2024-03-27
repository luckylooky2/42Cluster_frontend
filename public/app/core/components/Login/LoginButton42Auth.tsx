import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';

export const LoginButton42Auth = () => {
  const styles = useStyles2(getStyles);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <Button
      type="submit"
      data-testid="n/a"
      className={styles.submitButton}
      disabled={isLoggingIn}
      onClick={() => {
        setIsLoggingIn(true);
        localStorage.setItem('token', 'eyJh');
        window.location.href = 'http://localhost:3000/?auth_token=eyJh';
        // fetch(
        //   'http://localhost:3000/?auth_token=eyJh'
        // )
        //   .then((data) => data.text())
        //   .then((data) => {
        //     console.log(data);
        //   });
      }}
    >
      {isLoggingIn ? 'Logging in...' : 'Log in with 42 Auth'}
    </Button>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    submitButton: css({
      justifyContent: 'center',
      width: '100%',
    }),
  };
};
