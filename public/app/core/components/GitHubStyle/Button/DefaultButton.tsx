import { cx } from '@emotion/css';
import React from 'react';

import { useStyles2 } from '@grafana/ui';

import { GitHubButtonStyles } from '../../../../../style/GitHubButtonStyles';

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  type?: string;
}

const DefaultButton = ({ children, onClick, className, type = 'default' }: Props) => {
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const buttonCSS = type === 'default' ? gitHubButtonStyles.basicButton : gitHubButtonStyles.greenButton;

  return (
    <button className={cx(gitHubButtonStyles.button, buttonCSS, className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default DefaultButton;
