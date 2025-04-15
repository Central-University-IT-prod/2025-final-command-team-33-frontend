import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { QuestionMentorItem, getApps } from '../api';
import { applicationsA } from '../model/applications';

import { ButtonsAcceptReject } from './Button/button';

export const ApplicationCard = ({ app }: { app: QuestionMentorItem }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [confirmRejectModal, setConfirmRejectModal] = useState(false);

  const openModal = () => {
    setModalOpened(true);
  };

  const handleRejectConfirm = () => {
    setConfirmRejectModal(false);
  };

  const handleRejectCancel = () => {
    setConfirmRejectModal(false);
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        title={`Заявка от ${app.owner.name} ${app.owner.surname}`}>
        {app ? (
          <>
            <Text size='sm' style={{ wordWrap: 'break-word' }}>
              <b>Контакты:</b> {app.description}
            </Text>
            <Text
              size='sm'
              mt='sm'
              style={{
                wordWrap: 'break-word', // Для переноса длинных слов
                whiteSpace: 'normal' // Разрешение переноса текста
              }}>
              <b>Проблема:</b> {app.question.description}
            </Text>

            <Group mt='sm' style={{ flexWrap: 'wrap' }} gap={3} mb={'sm'}>
              {app.question.tags.map((tag, index) => (
                <Badge key={index} color='blue' style={{ marginRight: '8px' }}>
                  {tag}
                </Badge>
              ))}
            </Group>

            <ButtonsAcceptReject id={app.id} />
          </>
        ) : (
          <Text>Заявка не выбрана</Text>
        )}
      </Modal>

      <Modal
        opened={confirmRejectModal}
        onClose={() => setConfirmRejectModal(false)}
        title='Подтвердите отклонение'>
        <Text>Вы уверены, что хотите отклонить эту заявку?</Text>
        <Group mt='md'>
          <Button variant='outline' onClick={handleRejectCancel}>
            Отмена
          </Button>
          <Button color='red' onClick={handleRejectConfirm}>
            Отклонить
          </Button>
        </Group>
      </Modal>

      <Card
        key={app.id}
        shadow='sm'
        padding='lg'
        radius='md'
        mih='175'
        withBorder
        style={{
          width: '300px',
          flex: '1 0 300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '20px' // Добавление отступа между карточками
        }}>
        <Text
          fw={500}
          style={{
            cursor: 'pointer',
            color: 'black',
            fontSize: '16px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 3,
            textDecoration: 'none',
            textOverflow: 'ellipsis'
          }}
          onClick={openModal}>
          {app.description}
        </Text>

        <Stack
          gap={5}
          style={{
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row'
          }}>
          {app.question.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} color='blue' style={{ marginRight: '4px' }}>
              {tag}
            </Badge>
          ))}
          {app.question.tags.length > 2 && (
            <Badge color='blue' style={{ marginRight: '4px', marginBottom: '4px' }}>
              +{app.question.tags.length - 2}
            </Badge>
          )}
        </Stack>

        <ButtonsAcceptReject id={app.id} />
      </Card>
    </>
  );
};

export const ApplicationPage = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['applications'],
    queryFn: getApps
  });
  const navigate = useNavigate();
  const [applications, setApps] = useAtom(applicationsA);
  useEffect(() => {
    setApps(data || []);
  }, [data]);
  return (
    <Container size='xl' p='md' style={{ minHeight: '100vh', width: '100%' }}>
      <Stack>
        <Group>
          <Button
            maw='fit-content'
            onClick={() => {
              navigate({ to: '/mentor/resume-edit' });
            }}>
            Изменить резюме
          </Button>
          <Button
            maw='fit-content'
            onClick={() => {
              navigate({ to: '/mentor/active-tasks' });
            }}>
            Активные заявки
          </Button>
        </Group>
        <Title order={2} mb='md'>
          Входящих заявок: {applications?.length}
        </Title>
      </Stack>

      <Group
        gap='md'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px', // Увеличение зазора между карточками
          alignItems: 'flex-start', // Выравнивание по верхнему краю
          justifyContent: 'flex-start',
          width: '100%' // Страница будет заполняться на всю ширину
        }}>
        {isLoading // Показываем Skeleton во время загрузки данных
          ? new Array(4).fill(null).map((_, index) => (
              <Card
                key={index}
                shadow='sm'
                padding='lg'
                radius='md'
                mih='200'
                withBorder
                style={{
                  width: '300px',
                  flex: '1 0 300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                {['100%', '70%', '80%', '50%'].map((width, i) => (
                  <Skeleton
                    key={i}
                    height={i < 2 ? 15 : 20}
                    width={width}
                    mb={i === 0 ? 'xs' : '4px'}
                  />
                ))}
              </Card>
            ))
          : applications?.map(app => <ApplicationCard app={app} />)}
      </Group>
    </Container>
  );
};
