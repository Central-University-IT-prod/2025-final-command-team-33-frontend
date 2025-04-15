import { useQuery } from '@tanstack/react-query';

import { getUser } from '../api';

import { getToken } from '$/shared/lib/token';
import { ApplicationPage } from './ApplicationPage';
import { CreateResume } from './CreateResume';

export const MentorPage = () => {
  const { data } = useQuery({
    queryKey: ['user', getToken()],
    queryFn: getUser
  });
  const isHasResume = !!data?.description;
  console.log(isHasResume);
  if (isHasResume) {
    return <ApplicationPage />;
  }
  return <CreateResume />;
};
