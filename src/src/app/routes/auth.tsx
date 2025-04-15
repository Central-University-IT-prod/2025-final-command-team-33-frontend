import { createFileRoute, redirect } from '@tanstack/react-router';

import { AuthPage } from '$/pages/auth';
import { getToken } from '$/shared/lib/token';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  beforeLoad: () => {
    if (!!getToken()) {
      throw redirect({
        to: '/'
      });
    }
  }
});
