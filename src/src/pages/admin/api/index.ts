import { QuestionMentorItem } from '$/pages/mentor/api';
import { API_LINK } from '$/shared/constants';

interface Stats {
  total_users: number;
  total_questions: number;
  avg_questions_per_user: number;
  max_questions_by_user: number;
  min_questions_by_user: number;
}
export const getStats = async () => {
  const response = await fetch(API_LINK + '/admin/stats/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  return data as Stats;
};

export interface User {
  id: string; // Уникальный идентификатор пользователя
  name: string; // Имя пользователя
  surname: string; // Фамилия пользователя
  login: string; // Логин пользователя
  tags: string[]; // Массив тегов (интересов или навыков)
  description?: string; // Описание пользователя (опционально)
  job?: string; // Текущая должность пользователя (опционально)
  company?: string; // Компания пользователя (опционально)
  is_banned: boolean; // Флаг, указывающий, заблокирован ли пользователь
  is_verified: boolean;
}
export const getUsers = async () => {
  const response = await fetch(
    'https://prod-team-33-pafku5n2.REDACTED/api/admin/users/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const users = await response.json();
  return users as User[];
};

export const toggleBanUser = async (isBanned: boolean, userId: string) => {
  if (isBanned) {
    const response = await fetch(
      `https://prod-team-33-pafku5n2.REDACTED/api/admin/user/unblock/${userId}/`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = await response.json();
    return answer as { message?: string; error: string };
  }
  const response = await fetch(
    `https://prod-team-33-pafku5n2.REDACTED/api/admin/user/block/${userId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const answer = await response.json();
  return answer as { message?: string; error: string };
};

export const getProblems = async () => {
  const response = await fetch(API_LINK + '/');

  const users: User[] = await response.json(); // Парсим JSON-ответ
  return users;
};

export const verifUser = async ({
  userId,
  isVerified
}: {
  userId: string;
  isVerified: boolean;
}) => {
  const response = await fetch(API_LINK + `/admin/user/set_verified/${userId}/${isVerified}/`, {
    method: 'PATCH'
  });

  const users: { verififcated?: boolean } = await response.json(); // Парсим JSON-ответ
  return users;
};

export const getAllApps = async () => {
  const response = await fetch(API_LINK + `/admin/all_requests/`, {
    method: 'GET'
  });

  const apps = await response.json();
  return apps as QuestionMentorItem[];
};
