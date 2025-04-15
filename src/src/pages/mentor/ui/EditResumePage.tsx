import { useQuery } from '@tanstack/react-query';

import { getUser } from '../api';

import { getToken } from '$/shared/lib/token';
import { CreateResume } from './CreateResume';

export const EditResumePage = () => {
  const { data } = useQuery({
    queryKey: ['user', getToken()],
    queryFn: getUser
  });
  return <CreateResume editResume={data} />;
};
