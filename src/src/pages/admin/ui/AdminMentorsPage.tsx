import { Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import { BackButton } from '$/shared/ui/BackButton';
import { ListMentor } from './MentorsList';

export const AdminMentorsPage = () => {
  const navigate = useNavigate();
  return (
    <Stack
      w={'100%'}
      style={{
        minHeight: '100vh'
      }}>
      <BackButton
        onClick={() =>
          navigate({
            to: '/admin'
          })
        }
      />
      <ListMentor />
    </Stack>
  );
};
