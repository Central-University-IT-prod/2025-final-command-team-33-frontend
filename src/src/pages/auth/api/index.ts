import { RegistrationFormType } from '../ui/AuthPage';
import { LoginFormType } from '../ui/AuthPage';

import { API_LINK } from '$/shared/constants';

type RegProps = Omit<RegistrationFormType, 'confirmPassword'>;
export const regUser = async (props: RegProps) => {
  const response = await fetch(API_LINK + '/auth/reg/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(props)
  });

  return (await response.json()) as { token?: string; error?: string };
};

export const loginUser = async (props: LoginFormType) => {
  const response = await fetch(API_LINK + '/auth/login/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(props)
  });

  return (await response.json()) as { token?: string; error?: string };
};
