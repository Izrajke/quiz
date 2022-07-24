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

export interface CreatePackRequest {
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

export const createPack = (pack: CreatePackRequest) => {
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
