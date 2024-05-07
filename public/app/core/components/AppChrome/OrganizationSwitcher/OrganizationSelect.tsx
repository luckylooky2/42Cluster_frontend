import { css, cx } from '@emotion/css';
import React, { useState } from 'react';
import { GitHubHoverStyles } from 'style/GitHubHoverStyles';

import { SelectableValue, GrafanaTheme2 } from '@grafana/data';
import { Menu, Dropdown, useStyles2, ToolbarButton } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { UserOrg } from 'app/types';

import { OrganizationBaseProps } from './types';

export function OrganizationSelect({ orgs, onSelectChange }: OrganizationBaseProps) {
  const styles = useStyles2(getStyles);
  const { orgName: name, orgId, orgRole: role } = contextSrv.user;
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<SelectableValue<UserOrg>>(() => ({
    label: name,
    value: { role, orgId, name },
    description: role,
  }));
  const onChange = (option: SelectableValue<UserOrg>) => {
    setValue(option);
    onSelectChange(option);
  };
  const gitHubHoverStyles = useStyles2(GitHubHoverStyles);

  const createActions = orgs.map((org) => ({
    label: org.name,
    description: org.role,
    value: org,
  }));

  const MenuActions = () => {
    return (
      <Menu>
        {createActions.map((createAction, index) => (
          <Menu.Item
            key={index}
            label={createAction.label}
            checkType={true}
            isChecked={value.label === createAction.label}
            onClick={() => {
              onChange(createAction);
              return onSelectChange;
            }}
          />
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={MenuActions} placement="bottom-start" onVisibleChange={setIsOpen}>
      <div>
        <ToolbarButton isOpen={isOpen} className={cx(styles.button, gitHubHoverStyles.default)} aria-label="New">
          <b>{value.label}</b>
        </ToolbarButton>
      </div>
    </Dropdown>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  button: css({
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0.5, 1, 0.5, 1),
  }),
});
