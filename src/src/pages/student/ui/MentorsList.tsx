import { Badge, Button, Card, Group, Modal, Stack, TextInput, Title } from '@mantine/core';
import { Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

import { User } from '$/pages/admin/api';
import { BackButton } from '$/shared/ui/BackButton';
import styles from './MentorsList.module.scss';

export type Mentor = User;
const MentorItem = ({
  mentor,
  currMentors,
  setCurrMentors
}: {
  mentor: Mentor;
  currMentors: string[];
  setCurrMentors: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const breakpoint = useMediaQuery('(max-width: 868px)');
  const [opened, { open, close }] = useDisclosure(false);
  const onClick = () => {
    if (currMentors.length === 3 && !currMentors.includes(`${mentor.id}`)) {
      return;
    }
    if (currMentors.includes(`${mentor.id}`)) {
      setCurrMentors(v => v.filter(mentorId => mentorId != `${mentor.id}`));
    } else {
      setCurrMentors(v => [...v, `${mentor.id}`]);
    }
  };

  const sendButtonProps = {
    color: currMentors.length === 3 || currMentors.includes(`${mentor.id}`) ? 'gray' : 'yellow',
    onClick
  };
  const sendButtonText = currMentors.includes(`${mentor.id}`)
    ? 'Выбран'
    : currMentors.length === 3
      ? 'Достигнут лимит менторов'
      : 'Выбрать';

  return (
    <>
      <Modal opened={opened} onClose={close} title={`${mentor.name} ${mentor.surname}`} size='lg'>
        <Stack gap='md'>
          <Text fw={500} size='lg'>
            {mentor.job}
          </Text>

          <Text size='sm'>{mentor.description}</Text>

          <Group gap={5}>
            {mentor.tags.map(tag => (
              <Badge key={tag} variant='outline' color='blue' size='sm'>
                {tag}
              </Badge>
            ))}
          </Group>

          <Group>
            <Button onClick={close} color='red'>
              Закрыть
            </Button>
            <Button {...sendButtonProps}>{sendButtonText}</Button>
          </Group>
        </Stack>
      </Modal>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        maw={breakpoint ? '100%' : 400}
        w={'100%'}
        mih={100}>
        <Group>
          <Text size='lg' fw={500}>
            {mentor.name} {mentor.surname} {mentor.is_verified && <Badge>verified</Badge>}
          </Text>
        </Group>
        <Text size='lg' fw={500}>
          Рейтинг: {(mentor as any).rating}
        </Text>
        <Text c='dimmed' size='sm' style={{ marginTop: 5 }}>
          {mentor.job}
        </Text>
        <Text style={{ marginTop: 10 }} size='sm' truncate='end'>
          {mentor.description}
        </Text>
        <Group mt='md' gap={5} mb='sm'>
          {mentor.tags.map(tag => (
            <Badge key={tag} variant='outline' color='blue' size='sm'>
              {tag}
            </Badge>
          ))}
        </Group>
        <Stack gap={10}>
          <Button color='indigo' onClick={open}>
            Подробнее про ментора
          </Button>
          <Button {...sendButtonProps}>{sendButtonText}</Button>
        </Stack>
      </Card>
    </>
  );
};
export const MentorsList = ({
  mentors,
  setCurrMentors,
  currMentors,
  setMentors,
  setMentorsId
}: {
  mentors: Mentor[];
  currMentors: string[];
  setCurrMentors: React.Dispatch<React.SetStateAction<string[]>>;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  setMentorsId: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const breakpoint = useMediaQuery('(max-width: 868px)');
  const [tg, setTg] = useState('');
  return (
    <div className={styles.wrapper}>
      <Modal title='Введите контакты для связи' opened={opened} onClose={close}>
        <TextInput
          placeholder='Например: @my_contact (телеграм)'
          mb={10}
          onChange={e => setTg(e.currentTarget.value)}
          value={tg}
        />
        <Button
          disabled={tg.length === 0}
          onClick={() => {
            setMentorsId([tg, ...currMentors]);
          }}>
          Отправить
        </Button>
      </Modal>
      <BackButton onClick={() => setMentors([])} />
      <Title order={3} ta={breakpoint ? 'center' : 'left'}>
        Подходящие менторы ({currMentors.length}/3)
      </Title>
      <Text mb={10} ta={breakpoint ? 'center' : 'left'}>
        (Выбери до 3 менторов)
      </Text>
      {currMentors.length >= 1 && (
        <Button
          variant='outline'
          style={{
            marginInline: 'auto'
          }}
          onClick={open}
          mb='xs'>
          Отправить проблему
        </Button>
      )}
      <Group gap={10} justify={breakpoint ? 'center' : 'left'}>
        {mentors.map(m => {
          return (
            <MentorItem
              key={m.id}
              mentor={m}
              setCurrMentors={setCurrMentors}
              currMentors={currMentors}
            />
          );
        })}
      </Group>
    </div>
  );
};
