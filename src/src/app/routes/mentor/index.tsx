import { createFileRoute } from '@tanstack/react-router';

import { MentorPage } from '$/pages/mentor';

export const Route = createFileRoute('/mentor/')({
  component: MentorPage
});
