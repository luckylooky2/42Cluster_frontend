import { cx } from '@emotion/css';
import React, { ReactElement, useState } from 'react';

import { PanelModel } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

// import { Dropdown } from '../Dropdown/Dropdown';
import { UrlModule } from '../../../../../public/app/features/dashboard/utils/42cluster/urlModule';
import { ToolbarButton } from '../ToolbarButton';
import { TooltipPlacement } from '../Tooltip';

interface PanelMenuProps {
  menu: ReactElement | (() => ReactElement);
  menuButtonClass?: string;
  dragClassCancel?: string;
  panel?: PanelModel;
  title?: string;
  placement?: TooltipPlacement;
  offset?: [number, number];
  onOpenMenu?: () => void;
}

export function PanelMenu({
  menu,
  title,
  panel,
  placement = 'bottom',
  offset,
  dragClassCancel,
  menuButtonClass,
  onOpenMenu,
}: PanelMenuProps) {
  const testId = title ? selectors.components.Panels.Panel.menu(title) : `panel-menu-button`;
  const [isExpaned, setIsExpanded] = useState(window.location.search.includes('viewPanel'));

  // const handleVisibility = useCallback(
  //   (show: boolean) => {
  //     if (show && onOpenMenu) {
  //       onOpenMenu();
  //     }
  //   },
  //   [onOpenMenu]
  // );

  const expandPanel = () => {
    new UrlModule().addParam('viewPanel', String(panel?.id)).navigate();
    setIsExpanded(true);
  };

  const shrinkPanel = () => {
    new UrlModule().deleteParam('viewPanel').navigate();
    setIsExpanded(false);
  };

  return (
    // <Dropdown overlay={menu} placement={placement} offset={offset} onVisibleChange={handleVisibility}>
    <ToolbarButton
      aria-label={`Menu for panel with ${title ? `title ${title}` : 'no title'}`}
      title={isExpaned ? 'shrink' : 'expand'}
      icon={isExpaned ? 'minus' : 'plus'}
      iconSize="md"
      narrow
      data-testid={testId}
      onClick={isExpaned ? shrinkPanel : expandPanel}
      className={cx(menuButtonClass, dragClassCancel)}
    />
    // </Dropdown>
  );
}
