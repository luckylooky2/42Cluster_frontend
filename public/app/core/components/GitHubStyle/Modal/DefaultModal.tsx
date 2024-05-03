import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { customBackgroundColor } from '../../../../../style/color';
import DefaultButton from '../Button/DefaultButton';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const Overlay = () => {
  const styles = useStyles2(getStyles);
  return <div className={styles.overlay} />;
};

const DefaultModal = ({ isOpen, handleClose }: Props) => {
  const styles = useStyles2(getStyles);

  if (!isOpen) {
    return;
  }

  return (
    <div>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h1 className={styles.title}>배포</h1>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </header>
        <section className={styles.section}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </section>
        <footer className={styles.footer}>
          <DefaultButton text="test" type="green" onClick={() => {}} className={css({ width: '95%' })} />
        </footer>
      </div>
      <Overlay />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    borderRadius: '0.375rem 0.375rem 0 0',
  }),
  title: css({
    display: 'inline-block',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '0.5rem 0',
  }),
  closeButton: css({
    fontSize: '20px',
    color: '#333',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    filter: theme.isDark ? 'invert(100%)' : '',

    '&:hover': {
      color: 'cornflowerblue',
      filter: theme.isDark ? 'invert(0%)' : '',
    },
  }),
  section: css({
    backgroundColor: theme.isDark ? customBackgroundColor.dark.default : customBackgroundColor.light.primary,
    padding: '1rem',
    borderTop: '1px solid',
    borderDown: '1px solid',
    borderColor: theme.isDark ? '#30363d' : '#d0d7de',
  }),
  footer: css({
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    borderRadius: '0 0 0.375rem 0.375rem',
  }),
  modal: css({
    backgroundColor: theme.isDark ? customBackgroundColor.dark.primary : customBackgroundColor.light.default,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    minWidth: '640px',
    borderRadius: '5px',
    boxShadow: '0 3rem 5rem rgba(0, 0, 0, 0.3)',
    zIndex: '2000',
    borderColor: theme.isDark ? '#30363d' : '#d0d7de',
    borderStyle: 'solid',
    borderWidth: '1px',
  }),
  overlay: css({
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: '1000',
  }),
});

export default DefaultModal;
