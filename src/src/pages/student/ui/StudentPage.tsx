import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Task, createQuestion } from '../api';

import { SuccessScreen } from '$/shared/ui/SuccessScreen';
import { AddProblem } from './AddProblem';
import { Mentor, MentorsList } from './MentorsList';
import { SearchLoading } from './SearchLoading';

export const StudentPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isGetting, setGetting] = useState(false);
  const [currMentorsId, setCurrMentorsId] = useState<string[]>([]);
  const [mentorsId, setMentorsId] = useState<string[]>([]);
  const [task, setTask] = useState<Omit<Task, 'tg' | 'mentorsId'> | null>(null);
  const [isSuccess, setSuccsess] = useState(false);
  const { mutate: makeQuestion } = useMutation({
    mutationFn: createQuestion
  });
  useEffect(() => {
    if (mentorsId.length > 1) {
      const quesTask = {
        ...task,
        tg: mentorsId[0] || '',
        mentorsId: mentorsId.slice(1) || []
      } as Task;
      makeQuestion(quesTask);
      setSuccsess(true);
    }
  }, [mentorsId]);
  const navigate = useNavigate();
  if (isSuccess) {
    return (
      <SuccessScreen
        title='Проблема была отправлена менторам'
        onButtonClick={() => {
          navigate({
            to: '/student/problems'
          });
        }}
      />
    );
  }

  if (isGetting) {
    return <SearchLoading />;
  }

  // if (isSuccess) {
  //   return (
  //     <SuccessScreen
  //       title='Проблема была отправлена менторам'
  //       buttonText='Вернуться'
  //       onButtonClick={() => location.reload()}
  //     />
  //   );
  // }
  return (
    <>
      {mentors.length === 0 ? (
        <AddProblem setMentors={setMentors} setLoading={setGetting} setTask={setTask} />
      ) : (
        <MentorsList
          setMentorsId={setMentorsId}
          setMentors={setMentors}
          mentors={mentors}
          currMentors={currMentorsId}
          setCurrMentors={setCurrMentorsId}
        />
      )}
    </>
  );
};
