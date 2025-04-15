import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';

import styles from './MainPage.module.scss';

export const MainPage = () => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  return (
    <div className={styles['main-container']}>
      <Title mb={10}>Help</Title>

      <Text className={styles.description}>
        Проект, который помогает начинающим специалистам найти первую работу - стажировку.
      </Text>

      {isSmallScreen ? (
        <Stack gap='md' align='center'>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/mentor' })}>
            Роль ментора
          </Button>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/student' })}>
            Роль студента
          </Button>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/admin' })}>
            Админка
          </Button>
        </Stack>
      ) : (
        <Group gap='md' justify='center'>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/mentor' })}>
            Роль ментора
          </Button>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/student' })}>
            Роль студента
          </Button>
          <Button variant='light' fullWidth onClick={() => navigate({ to: '/admin' })}>
            Админка
          </Button>
        </Group>
      )}
    </div>
  );
};
