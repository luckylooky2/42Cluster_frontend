import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Menu, Dropdown, useStyles2, ToolbarButton } from '@grafana/ui';
// import { OptionsPickerState } from 'app/features/variables/pickers/OptionsPicker/reducer';
import { FourtyTwoClusterBackendDashboard, useSelector } from 'app/types';

import { GitHubButtonStyles } from '../../../../style/GitHubButton';

type MockText = {
  text: string;
};

interface Props {
  // picker: OptionsPickerState;
  picker: { options: MockText[] };
}

const OptionSelect = ({ picker }: Props) => {
  const dashboards = useSelector((state) => state.fourtyTwoClusterBackend).dashboards;
  const [isOpen, setIsOpen] = useState(false);
  const gitHubButtonStyles = useStyles2(GitHubButtonStyles);
  const styles = useStyles2(getStyles);
  // 1. 현재 대시보드 uid 가져오기
  const currDashboard: FourtyTwoClusterBackendDashboard = dashboards.length
    ? dashboards.filter((v) => v.uid === window.location.pathname.split('/')[2])[0]
    : { uid: '', namespace: '', url: '', subCategory: null };

  const createActions = picker.options.map((option, index) => ({
    id: index,
    text: option.text,
    icon: 'plus',
    url: `/d/${currDashboard.uid}/${currDashboard.namespace}?var-${currDashboard.subCategory}=${option.text}`,
    hideFromTabs: true,
    isCreateAction: true,
  }));
  // 2. 현재 체크된 것 가져오기
  const findIndex = window.location.href.indexOf(`var-${currDashboard.subCategory}`);
  const currSubCategory =
    findIndex > 0
      ? createActions.filter((v) => window.location.href.slice(findIndex + 1).includes(v.text))[0].text
      : createActions[0].text;

  //   useEffect(() => {
  //     if (backendState.dashboards.length) {
  //       setCurrDashboard(backendState.dashboards[0].namespace);
  //     }
  //   }, [backendState.dashboards]);

  const MenuActions = () => {
    return (
      <Menu>
        {createActions.map((createAction, index) => (
          <Menu.Item
            key={index}
            url={createAction.url}
            label={createAction.text}
            checkType={true}
            isChecked={currSubCategory === createAction.text}
            onClick={() => {
              //   const target = e.target as HTMLButtonElement;
              reportInteraction('grafana_menu_item_clicked', { url: createAction.url, from: 'quickadd' });
              //   setCurrDashboard(target.textContent === null ? '' : target.textContent);
            }}
          />
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={MenuActions} placement="bottom-start" onVisibleChange={setIsOpen}>
      <ToolbarButton
        isOpen={isOpen}
        className={`${gitHubButtonStyles.button} ${gitHubButtonStyles.greenButton}`}
        aria-label="New"
      >
        <div className={styles.ellipsis}>{currSubCategory}</div>
      </ToolbarButton>
    </Dropdown>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  buttonContent: css({
    alignItems: 'center',
    display: 'flex',
  }),
  buttonText: css({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }),
  ellipsis: css({ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
});

export default OptionSelect;
