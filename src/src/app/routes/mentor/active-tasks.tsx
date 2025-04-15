import { createFileRoute } from '@tanstack/react-router';

import { ActiveTasksPage } from '$/pages/mentor/ui/ActiveTasksPage';

export const Route = createFileRoute('/mentor/active-tasks')({
  component: ActiveTasksPage
});
