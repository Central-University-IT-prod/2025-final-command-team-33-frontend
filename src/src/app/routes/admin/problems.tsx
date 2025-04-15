import { createFileRoute } from '@tanstack/react-router';

import { AdminProblemsPage } from '$/pages/admin';

export const Route = createFileRoute('/admin/problems')({
  component: AdminProblemsPage
});
