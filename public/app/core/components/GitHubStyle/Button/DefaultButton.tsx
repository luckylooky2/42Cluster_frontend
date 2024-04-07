import { css, CSSInterpolation } from '@emotion/css';
import React from 'react';

import { useStyles2 } from '@grafana/ui';

import { GitHubButtonStyles } from '../../../../../style/GitHubButton';

interface Props {
  text: string;
  style?: CSSInterpolation;
  type?: string;
}

const DefaultButton = ({ text, style, type = 'default' }: Props) => {
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const buttonCSS = type === 'default' ? gitHubButtonStyles.basicButton : gitHubButtonStyles.greenButton;

  return <button className={`${gitHubButtonStyles.button} ${buttonCSS} ${css(style)}`}>{text}</button>;
};

export default DefaultButton;
