import { createFileRoute, redirect } from '@tanstack/react-router';

import { EditResumePage } from '$/pages/mentor';

export const Route = createFileRoute('/mentor/resume-edit')({
  component: EditResumePage,
  beforeLoad: async () => {
    const isHasResume = true;
    if (!isHasResume)
      throw redirect({
        to: '/mentor'
      });
  }
});
