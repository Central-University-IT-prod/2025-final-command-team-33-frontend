import { Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

import { BackButton } from '$/shared/ui/BackButton';
import { RequestList } from './ListProblems';

export const AdminProblemsPage = () => {
  const navigate = useNavigate();
  return (
    <Stack
      w={'100%'}
      mih='100vh'
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
      <RequestList />
    </Stack>
  );
};
