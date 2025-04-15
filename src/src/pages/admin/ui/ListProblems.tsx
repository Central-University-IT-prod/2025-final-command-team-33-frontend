import { Button, Card, Group, Modal, Pagination, Skeleton, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getAllApps } from '../api';

import { QuestionMentorItem } from '$/pages/mentor/api';

// Компонент RequestCard
const RequestCard = ({ request }: { request: QuestionMentorItem }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);

  const closeModal = () => setOpened(false);
  const closeDeleteModal = () => setDeleteOpened(false);
  const openModal = () => setOpened(true);
  const openDeleteModal = () => setDeleteOpened(true);

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row', // Все элементы в одну строку
    justifyContent: 'space-between', // Распределение пространства между элементами
    alignItems: 'center', // Вертикальное выравнивание
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
    width: '100%',
    cursor: 'pointer',
    gap: '10px',
    flexWrap: 'wrap' // Расстояние между элементами
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 500,
    color: '#333',
    whiteSpace: 'nowrap', // Текст не переносится
    overflow: 'hidden', // Скрываем лишний текст
    textOverflow: 'ellipsis', // Добавляем многаоточие
    textAlign: 'left',
    width: '300px'
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row', // Кнопки всегда в строку
    gap: '10px', // Расстояние между кнопками
    flexShrink: 0, // Кнопки не сжимаются
    minWidth: '200px' // Минимальная ширина для контейнера кнопок
  };

  return (
    <>
      {/* Модальное окно с подробной информацией */}
      <Modal opened={opened} onClose={closeModal} title='Подробная информация о запросе'>
        {request && (
          <>
            <Text>
              <strong>Создатель:</strong> {request.owner.login}
            </Text>
            <Text style={{ wordWrap: 'break-word' }}>
              <strong>Описание:</strong> {request.description}
            </Text>
            <Text>
              <strong>Теги:</strong> {request.question.tags.join(', ')}
            </Text>
            <Text>
              <strong>Статус:</strong>{' '}
              {request.status === 0
                ? 'На рассмотрении'
                : request.status === 1
                  ? 'Принято'
                  : 'Ментор(ы) отказал(и)'}
            </Text>
          </>
        )}
        <Group style={{ marginTop: '20px' }}>
          <Button onClick={closeModal} variant='outline' color='gray'>
            Закрыть
          </Button>
        </Group>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal opened={deleteOpened} onClose={closeDeleteModal} title='Подтверждение удаления'>
        <Text>Вы уверены, что хотите удалить этот запрос?</Text>
        <Group style={{ marginTop: '20px' }}>
          <Button onClick={closeDeleteModal} variant='outline' color='gray'>
            Отмена
          </Button>
          <Button onClick={() => console.log('Удалить запрос')} color='red'>
            Удалить
          </Button>
        </Group>
      </Modal>

      {/* Карточка запроса */}
      <Card
        style={cardStyle}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
        <Text style={titleStyle}>{request.question.title}</Text>
        <div style={buttonContainerStyle}>
          <Button
            onClick={openModal}
            color='blue'
            size={isMobile ? 'xs' : 'sm'}
            style={{ flex: '0 0 auto', minWidth: '100px' }}>
            Подробнее
          </Button>
          <Button
            onClick={openDeleteModal}
            color='red'
            size={isMobile ? 'xs' : 'sm'}
            style={{ flex: '0 0 auto', minWidth: '100px' }}>
            Удалить
          </Button>
        </div>
      </Card>
    </>
  );
};
// Компонент RequestList
export const RequestList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 4;

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Стили для контейнера
  const containerStyle: React.CSSProperties = {
    padding: isMobile ? '10px' : '20px', // Отступы зависят от разрешения экрана
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto', // Центрирование по горизонтали
    display: 'block', // Обеспечиваем блочное поведение
    boxSizing: 'border-box' // Учитываем padding в ширине элемента
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'left', // Выравнивание заголовка слева
    marginBottom: '20px', // Отступ снизу от заголовка
    color: '#333',
    fontSize: isMobile ? '24px' : '32px'
  };

  const paginationContainerStyle: React.CSSProperties = {
    marginTop: '10px', // Отступ сверху для пагинации
    display: 'flex',
    justifyContent: 'center' // Пагинация по центру
  };

  const startIndex = (currentPage - 1) * requestsPerPage;

  const { data: apps, isPending } = useQuery({
    queryFn: getAllApps,
    queryKey: []
  });

  const currentRequests =
    apps && apps.length ? apps.slice(startIndex, startIndex + requestsPerPage) : [];

  return (
    <div style={containerStyle}>
      {/* Заголовок наверху */}
      <Title style={titleStyle}>Список запросов</Title>

      {/* Список запросов */}
      <ul style={{ padding: 0 }}>
        {isPending
          ? [...new Array(requestsPerPage)].map((_, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <Skeleton height={isMobile ? 40 : 50} width='100%' />
              </li>
            ))
          : currentRequests?.map(request => (
              <li key={request.id} style={{ marginBottom: '10px' }}>
                <RequestCard request={request} />
              </li>
            ))}
      </ul>

      {/* Пагинация */}
      <div style={paginationContainerStyle}>
        <Pagination
          onChange={setCurrentPage}
          total={Math.ceil((apps?.length || 0) / requestsPerPage)}
          size={isMobile ? 'xs' : 'lg'}
        />
      </div>
    </div>
  );
};
