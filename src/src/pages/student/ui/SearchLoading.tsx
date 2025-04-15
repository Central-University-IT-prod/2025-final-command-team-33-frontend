import { Loader, Title } from '@mantine/core';

import styles from './SearchLoading.module.scss';

export const SearchLoading = () => {
  return (
    <div className={styles.loading}>
      <Loader size='xl' variant='bars' />
      <Title order={3}>Ищем подходящих менторов...</Title>
    </div>
  );
};
