import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  Pagination,
  Skeleton,
  Text,
  Title
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { User, getUsers, toggleBanUser, verifUser } from '../api';

const MentorCard = ({ mentor }: { mentor: User }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const onOpenModal = () => {
    setOpened(true);
  };
  const [verified, setVerified] = useState(mentor.is_verified);
  const [frozen, setFrozen] = useState(mentor.is_banned);
  const { mutate: verif, isPending: isVerif } = useMutation({
    mutationFn: verifUser,
    onSuccess: () => {
      setVerified(v => !v);
    }
  });

  const handleVerify = (): void => {
    verif({ userId: mentor.id, isVerified: !verified });
  };

  const { mutate: toggleBan, isPending: isBanning } = useMutation({
    mutationFn: ({ isBanned, userId }: { isBanned: boolean; userId: string }) =>
      toggleBanUser(isBanned, userId),
    onSuccess: () => {
      setFrozen(v => !v);
    }
  });
  const handleFreeze = (): void => {
    toggleBan({ userId: mentor.id, isBanned: !frozen });
  };
  return (
    <>
      <Card shadow='sm' padding='lg' style={{ marginBottom: 20 }}>
        <Group>
          <Title
            order={4}
            style={{
              width: 160,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            {mentor.login}
          </Title>
          <Button onClick={onOpenModal}>Подробнее</Button>
        </Group>
      </Card>
      <Modal centered opened={opened} onClose={() => setOpened(false)} title='Детали ментора'>
        {mentor && (
          <>
            <Text>Логин: {mentor.login}</Text>
            <Text>Количество помощи: {0}</Text>
            <Text>Теги: {mentor.tags.join(', ')}</Text>

            <Group style={{ marginTop: 20 }}>
              <Button
                onClick={handleVerify}
                style={{ width: 170 }}
                disabled={isVerif}
                loading={isVerif}>
                {verified ? 'Снять вериф.' : 'Верифицировать'}
              </Button>
              <Button onClick={handleFreeze} disabled={isBanning} loading={isBanning}>
                {frozen ? 'Разбан' : 'Забанить'}
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </>
  );
};

export const ListMentor = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: getUsers
  });

  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const mentorsPerPage = 3;
  const totalMentors = mentors.length || 0;
  const totalPages = Math.ceil(totalMentors / mentorsPerPage);

  const getMentorsForPage = (page: number): User[] => {
    const startIndex = (page - 1) * mentorsPerPage;
    const endIndex = startIndex + mentorsPerPage;
    return mentors.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setMentors(users?.filter(user => !!user.description) || []);
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [users, isLoading]);

  return (
    <Container>
      <Title style={{ textAlign: 'center' }}>Список менторов</Title>

      {loading
        ? [...new Array(mentorsPerPage)].map((_, index) => (
            <Skeleton key={index} height={70} radius='md' style={{ marginBottom: 20 }} />
          ))
        : getMentorsForPage(currentPage).map((mentor, index) => (
            <MentorCard key={index} mentor={mentor} />
          ))}

      <Pagination
        onChange={(page: number) => setCurrentPage(page)}
        total={totalPages}
        style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};
