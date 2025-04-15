import { User } from '$/pages/admin/api';
import { API_LINK } from '$/shared/constants';
import { getToken } from '$/shared/lib/token';

export const updateUser = async (user: Partial<User>) => {
  const token = getToken();
  const response = await fetch(API_LINK + '/auth/', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) // Добавляем токен, если он есть
    },
    body: JSON.stringify(user)
  });

  const res = await response.json();

  return res as { error?: string };
};
export const getUser = async () => {
  const response = await fetch(API_LINK + '/user/info/me/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as User;
};

interface Mentor extends User {
  rating: number;
}

interface Question {
  description: string;
  id: string;
  mentor_id?: string | null;
  owner_id: string;
  rating_payed: number;
  status: number;
  tags: string[];
  title: string;
}

export interface QuestionMentorItem {
  description: string;
  id: string;
  mentor: Mentor;
  owner: User;
  question: Question;
  status: number;
}
export const getApps = async () => {
  const response = await fetch(API_LINK + '/request/incoming/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as QuestionMentorItem[];
};

export const getActiveApps = async () => {
  const response = await fetch(API_LINK + '/request/accepted/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as QuestionMentorItem[];
};
export const decline = async ({ id }: { id: string }) => {
  const response = await fetch(API_LINK + `/request/${id}/decline/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as { error?: string };
};

export const accept = async ({ id }: { id: string }) => {
  const response = await fetch(API_LINK + `/request/${id}/accept/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const res = await response.json();
  return res as { error?: string };
};
