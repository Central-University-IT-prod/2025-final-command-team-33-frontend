import { atom } from 'jotai';

import { QuestionMentorItem } from '../api';

export const applicationsA = atom<QuestionMentorItem[]>([]);
