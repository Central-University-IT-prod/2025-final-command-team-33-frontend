import { Button, Group, MantineProvider, createTheme } from '@mantine/core';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { getToken, setToken } from '$/shared/lib/token';
import styles from './RootLayout.module.scss';

const theme = createTheme({});
export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  const navigate = useNavigate();
  const locationDyn = useLocation();

  useEffect(() => {
    if (!getToken() && locationDyn.href !== '/auth') {
      navigate({ to: '/auth' });
    }
  }, [locationDyn]);
  return (
    <MantineProvider theme={theme}>
      <Toaster />
      {token && (
        <Group justify='right' className={styles.logoutWrapper}>
          <Button
            color='red'
            variant='filled'
            onClick={() => {
              setToken('');
              navigate({ to: '/auth' });
              location.reload();
            }}>
            Выйти
          </Button>
        </Group>
      )}
      {locationDyn.href !== '/' && (
        <Button variant='light' onClick={() => navigate({ to: '/' })} className={styles.mainButton}>
          Вернуться на главную
        </Button>
      )}
      <div className={styles.wrapper}>{children}</div>
    </MantineProvider>
  );
};
