import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { getStats } from '../api';

const statsDescriptions = {
  total_users: 'Общее количество зарегистрированных пользователей',
  total_questions: 'Общее количество созданных вопросов',
  avg_questions_per_user: 'Среднее количество вопросов на одного пользователя',
  max_questions_by_user: 'Максимальное количество вопросов, созданное одним пользователем',
  min_questions_by_user: 'Минимальное количество вопросов, созданное одним пользователем'
};
export const AdminPanel = () => {
  const { data, isPending } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats
  });

  const navigate = useNavigate();

  return (
    <>
      <Stack>
        <Title order={3}>Админ панель</Title>
        <Stack>
          <Stack gap={5}>
            {Object.entries(statsDescriptions).map(st => {
              return (
                <Text>
                  {st[1]}: {isPending ? '...' : data?.[st[0] as keyof typeof statsDescriptions]}
                </Text>
              );
            })}
          </Stack>
          <Group gap={10}>
            <Button onClick={() => navigate({ to: '/admin/users' })}>
              Управление пользователями
            </Button>
            <Button onClick={() => navigate({ to: '/admin/problems' })}>
              Управление проблемами
            </Button>
            <Button onClick={() => navigate({ to: '/admin/mentors' })}>Управление менторами</Button>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};
