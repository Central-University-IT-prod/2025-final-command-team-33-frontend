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
  Textarea,
  Title
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Project, getUserQuestions, problemDelete, problemDone } from '../api';

import { BackButton } from '$/shared/ui/BackButton';

const Problem = ({
  app,
  setQuestions
}: {
  app: Project;
  setQuestions: React.Dispatch<React.SetStateAction<Project[]>>;
}) => {
  const [reviewOpened, setReviewOpened] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isReviewValid, setIsReviewValid] = useState(false);

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setReviewText(text);
    if (text.length >= 10) {
      setIsReviewValid(true);
    } else {
      setIsReviewValid(false);
    }
  };

  const { mutate: helpReject } = useMutation({
    mutationFn: problemDelete,
    onMutate: () => setQuestions(q => q.filter(p => p.id !== app.id))
  });
  const handleSubmitReview = () => {
    helpReject(app.id);
  };
  const [modalOpened, setModalOpened] = useState(false);
  const openModal = () => {
    setModalOpened(true);
  };
  const { mutate: helpDone } = useMutation({
    mutationFn: problemDone,
    onMutate: () => setQuestions(q => q.filter(p => p.id !== app.id))
  });
  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        title='Детали заявки'
        size='lg'>
        {app ? (
          <>
            <Text size='sm' style={{ wordWrap: 'break-word' }}>
              <b>Название:</b> {app.title}
            </Text>
            <Text size='sm' mt='sm' style={{ wordWrap: 'break-word' }}>
              <b>Описание:</b> {app.description}
            </Text>

            <Text size='sm' mt='sm'>
              <b>Статус:</b> {app.mentor_id ? 'В процессе решения проблемы' : 'На расмотрение'}
            </Text>
            <Group mt='sm' gap='xs'>
              {app.tags.map((tag, index) => (
                <Badge key={index} color='blue'>
                  {tag}
                </Badge>
              ))}
            </Group>
          </>
        ) : (
          <Text>Заявка не выбрана</Text>
        )}
      </Modal>

      <Modal
        opened={reviewOpened}
        onClose={() => setReviewOpened(false)}
        centered
        title='Отзыв'
        size='lg'>
        <Textarea
          value={reviewText}
          onChange={handleReviewChange}
          description={'Мин. кол-во 10 символов'}
          minLength={10}
          maxLength={1000}
          placeholder='Почему не помог?'
          autosize
          minRows={3}
          maxRows={5}
        />
        <Text size='sm' mt='sm'>
          {reviewText.length} / 1000 символов
        </Text>
        <Group mt='md'>
          <Button variant='outline' onClick={handleSubmitReview} disabled={!isReviewValid}>
            Отправить отзыв
          </Button>
          <Button variant='outline' onClick={() => setReviewOpened(false)}>
            Закрыть
          </Button>
        </Group>
      </Modal>
      <Card
        key={app.id}
        shadow='sm'
        padding='lg'
        radius='md'
        mih={220}
        withBorder
        style={{
          width: '300px',
          flex: '1 0 300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
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
          onClick={() => openModal()}>
          {app.title}
        </Text>
        <Stack
          gap='4px'
          mt='sm'
          mb='15px'
          style={{
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row'
          }}>
          {app.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} color='blue' style={{ marginRight: '8px' }}>
              {tag}
            </Badge>
          ))}
          {app.tags.length > 2 && (
            <Badge color='blue' style={{ marginRight: '8px', marginBottom: '4px' }}>
              +{app.tags.length - 2}
            </Badge>
          )}
        </Stack>
        <Group
          style={{
            flexShrink: 0,
            alignItems: 'center',
            gap: '10px'
          }}>
          <Stack gap={5} mb={10}>
            <Text size='sm'>
              {app.mentor_id ? 'В процессе решения проблемы' : 'На рассмотрении у менторов'}
            </Text>
            {app.mentor_id ? (
              <Group gap='sm'>
                <Button variant='outline' onClick={() => setReviewOpened(true)} size='compact'>
                  Ментор не помог
                </Button>
                <Button variant='outline' size='compact' onClick={() => helpDone(app.id)}>
                  Ментор помог
                </Button>
              </Group>
            ) : (
              <Button mb={10} onClick={() => helpReject(app.id)}>
                Отменить заявку
              </Button>
            )}
          </Stack>
        </Group>
        <Button
          fullWidth
          variant='outline'
          onClick={() => openModal()}
          style={{ marginTop: 'auto' }}>
          Подробнее
        </Button>
      </Card>
    </>
  );
};
export const ProblemsPage = () => {
  const { data, isPending } = useQuery({
    queryFn: getUserQuestions,
    queryKey: ['questions']
  });

  const [questions, setQuestions] = useState<Project[]>([]);
  useEffect(() => {
    setQuestions(data || []);
  }, [data]);
  return (
    <Container
      size='xl'
      p='md'
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '100vh'
      }}>
      <BackButton onClick={() => (window.location.href = '/')} />

      <Title order={2} mb='md'>
        Ваши активные проблемы: {questions?.length}
      </Title>

      <Group
        gap='md'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          margin: '0 -15px',
          width: '100%'
        }}>
        {isPending
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
                  justifyContent: 'space-between'
                }}>
                {['100%', '70%', '80%', '50%'].map((width, i) => (
                  <Skeleton key={i} height={i < 2 ? 20 : 30} width={width} mb={i < 2 ? 'sm' : 0} />
                ))}
              </Card>
            ))
          : questions?.map(app => <Problem app={app} setQuestions={setQuestions} />)}
      </Group>
    </Container>
  );
};
