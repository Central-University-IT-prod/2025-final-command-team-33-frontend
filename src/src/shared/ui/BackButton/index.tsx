import { Button } from '@mantine/core';

import { IconArrowBackUp } from './IconArrowBackUp';

export const BackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      leftSection={<IconArrowBackUp />}
      onClick={onClick}
      mb={20}
      mih={36}
      style={{
        alignSelf: 'left',
        maxWidth: 'fit-content'
      }}>
      Назад
    </Button>
  );
};
