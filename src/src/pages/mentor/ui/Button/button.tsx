import { Button, Group } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { accept, decline } from '../../api';
import { applicationsA } from '../../model/applications';

export const ButtonsAcceptReject = ({ id }: { id: string }) => {
  const [, setApps] = useAtom(applicationsA);
  const { mutate: declineReq } = useMutation({
    mutationKey: ['decline', id],
    mutationFn: decline,
    onSuccess: () => {
      setApps(apps => apps.filter(app => app.id !== id));
    }
  });
  const { mutate: acceptReq } = useMutation({
    mutationKey: ['accept', id],
    mutationFn: accept,
    onSuccess: () => {
      setApps(apps => apps.filter(app => app.id !== id));
    }
  });

  return (
    <Group style={{ width: '100%' }}>
      <Button
        onClick={() => acceptReq({ id })}
        color='green'
        style={{
          flex: 1,
          padding: '6px' // Уменьшаем внутренний отступ
        }}>
        Принять
      </Button>
      <Button
        color='red'
        style={{
          flex: 1,
          padding: '6px'
        }}
        onClick={() => declineReq({ id })} // Вызываем onReject при нажатии
      >
        Отклонить
      </Button>
    </Group>
  );
};
