import { createFileRoute } from '@tanstack/react-router';

import { ProblemsPage } from '$/pages/student';

export const Route = createFileRoute('/student/problems')({
  component: ProblemsPage
});
