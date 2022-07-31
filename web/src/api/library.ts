import { api, BACKEND_URL } from 'api';

export interface NormalizedRangeQuestionsData {
  title: string;
  answer: number;
}

export interface NormalizedMultipleChoiceQuestionsData {
  title: string;
  options: string[];
  answer: number;
}

export interface NormalizedPackData {
  categoryId: number;
  title: string;
  pack: {
    rangeQuestions: NormalizedRangeQuestionsData[];
    multipleChoiceQuestions: NormalizedMultipleChoiceQuestionsData[];
  };
}

export interface CreatePackResponse {
  success: boolean;
}

export const createPack = (pack: NormalizedPackData) => {
  const body = JSON.stringify(pack);

  return api({
    input: `${BACKEND_URL}/api/pack/create`,
    init: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body,
    },
  });
};

export const loadPack = (id: string) => {
  return api({
    input: `${BACKEND_URL}/api/pack/view/${id}`,
    init: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  });
};
