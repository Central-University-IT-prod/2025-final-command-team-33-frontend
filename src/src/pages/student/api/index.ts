import { User } from '$/pages/admin/api';
import { API_LINK } from '$/shared/constants';
import { getToken } from '$/shared/lib/token';

export const getMentors = async (tags: string[]) => {
  const requestBody = JSON.stringify(tags);

  const response = await fetch(`${API_LINK}/tags/mentors/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: requestBody
  });
  const res = await response.json();

  return res as User[];
};
export interface Task {
  title?: string; // Заголовок задачи
  description?: string; // Описание задачи
  tags: string[]; // Массив тегов, связанных с задачей
  tg: string;
  mentorsId: string[];
}
export const createQuestion = async (task: Task) => {
  const { mentorsId, tg, ...other } = task;
  const token = getToken();
  const response = await fetch(API_LINK + '/question/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) // Добавляем токен, если он есть
    },
    body: JSON.stringify(other)
  });

  const res = (await response.json()) as { question_id?: string };

  if (!res.question_id) return;

  const req = await fetch(API_LINK + `/request/${res.question_id}/many/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) // Добавляем токен, если он есть
    },
    body: JSON.stringify({
      mentors_id: mentorsId,
      description: tg
    })
  });

  const reqRes = await req.json();
  return reqRes;
};

interface Owner {
  company: string | null; // Компания владельца (может быть null)
  description: string; // Описание владельца
  id: string; // Уникальный идентификатор владельца
  is_banned: boolean; // Флаг блокировки
  is_verified: boolean; // Флаг верификации
  job: string; // Работа/профессия владельца
  login: string; // Логин владельца
  name: string; // Имя владельца
  password: string; // Пароль владельца (не рекомендуется хранить в открытом виде)
  rating: number; // Рейтинг владельца
  surname: string; // Фамилия владельца
  tags: string[]; // Теги владельца
}

export interface Project {
  description: string; // Описание проекта
  id: string; // Уникальный идентификатор проекта
  mentor: null | string; // Ментор проекта (может быть null)
  mentor_id: null | string; // ID ментора (может быть null)
  owner: Owner; // Владелец проекта
  owner_id: string; // ID владельца проекта
  rating_payed: number; // Оценка, полученная за проект
  status: number; // Статус проекта (например, 0 - не завершен, 1 - принят, -1 - пне принят)
  tags: string[]; // Теги проекта
  title: string; // Название проекта
}

export const getUserQuestions = async () => {
  const response = await fetch(`${API_LINK}/question/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as Project[];
};

export const problemDone = async (id: string) => {
  const response = await fetch(`${API_LINK}/question/${id}/solved/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as { error?: string };
};

export const problemDelete = async (id: string) => {
  const response = await fetch(`${API_LINK}/question/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as { error?: string };
};
