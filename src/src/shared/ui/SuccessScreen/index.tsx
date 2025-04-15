import { Button, Center, Group, Text, Title } from '@mantine/core';

import { IconCheck } from './IconCheck';

interface SuccessScreenProps {
  title: string; // Кастомный заголовок
  description?: string; // Описание (необязательно)
  buttonText?: string; // Текст кнопки (необязательно)
  onButtonClick?: () => void; // Обработчик клика на кнопку (необязательно)
}

export const SuccessScreen = ({
  title,
  description,
  buttonText = 'Вернуться',
  onButtonClick = () => {}
}: SuccessScreenProps) => {
  return (
    <Center style={{ height: '100vh', width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <IconCheck />

        <Title order={2} mt='0' c='green'>
          {title}
        </Title>

        {description && (
          <Text size='lg' color='dimmed' mt='sm'>
            {description}
          </Text>
        )}

        <Group mt='sm' justify='center'>
          <Button variant='outline' size='md' radius='md' onClick={onButtonClick}>
            {buttonText}
          </Button>
        </Group>
      </div>
    </Center>
  );
};
