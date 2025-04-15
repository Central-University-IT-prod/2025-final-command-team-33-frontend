import { createFileRoute } from '@tanstack/react-router';

import { AdminMentorsPage } from '$/pages/admin/ui/AdminMentorsPage';

export const Route = createFileRoute('/admin/mentors')({
  component: AdminMentorsPage
});
