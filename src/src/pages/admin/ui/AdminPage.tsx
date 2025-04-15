import styles from './AdminPage.module.scss';
import { AdminPanel } from './AdminPanel';

export const AdminPage = () => {
  return (
    <div className={styles.wrapper}>
      <AdminPanel />
    </div>
  );
};
