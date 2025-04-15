import { Button, Card, Group, Pagination, Text, Title, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { User, getUsers, toggleBanUser } from '../api';

const UserItem = ({ user, refetch }: { user: User; refetch: any }) => {
  const listItemStyle: React.CSSProperties = {
    marginBottom: '16px'
  };
  const [isBanned, setBanned] = useState(user.is_banned);

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
    width: '100%',
    cursor: 'pointer'
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.backgroundColor = '#f7f7f7';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
  };

  const {
    mutate: toggleBan,
    isPending,
    isError
  } = useMutation({
    mutationFn: ({ isBanned, userId }: { isBanned: boolean; userId: string }) =>
      toggleBanUser(isBanned, userId),
    onSuccess: () => {
      refetch();
      setBanned(v => !v);
    }
  });

  return (
    <li key={user.id} style={listItemStyle}>
      <Card style={cardStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <Group style={userInfoStyle}>
          <Text style={{ fontWeight: 500, color: '#333' }}>{user.id}</Text>
          <Tooltip label={user.login} openDelay={500}>
            <Text
              style={{
                fontWeight: 'normal',
                textTransform: 'none',
                color: '#333',
                wordBreak: 'break-word'
              }}>
              {user.login}
            </Text>
          </Tooltip>
        </Group>
        <Group style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#333' }}>Запросов: {0}</Text>
          <Button
            onClick={() => {
              toggleBan({ isBanned, userId: user.id });
            }}
            color={isBanned ? 'green' : 'blue'}
            size='xs'
            loading={isPending}
            disabled={isPending || isError}
            style={{ width: '140px', marginLeft: '15px' }}>
            {isError ? 'Не получилось' : isBanned ? 'Разблокировать' : 'Заблокировать'}
          </Button>
        </Group>
      </Card>
    </li>
  );
};

export const ListUser = () => {
  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const isMobile = useMediaQuery('(max-width: 768px)');

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    width: '100%'
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  };

  const listStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  };

  const paginationContainerStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center'
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const sortedUsers = (users || []).sort((a, b) => a.login.localeCompare(b.login, 'und'));
  const currentUsers = sortedUsers?.slice(startIndex, startIndex + usersPerPage);

  return (
    <div style={containerStyle}>
      <Title style={titleStyle}>Список пользователей</Title>
      <ul style={listStyle}>
        {currentUsers?.map(user => <UserItem user={user} key={user.id} refetch={refetch} />)}
      </ul>
      <div style={paginationContainerStyle}>
        <Pagination
          onChange={setCurrentPage}
          total={Math.ceil((users?.length || 0) / usersPerPage)}
          size={isMobile ? 'sm' : 'lg'}
        />
      </div>
    </div>
  );
};
