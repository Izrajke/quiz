import { api, BACKEND_URL, DICTIONARIES } from 'api';

export interface CreateLobbyParams {
  name: string;
  players: number;
  password?: string;
}

export const createLobby = (params: CreateLobbyParams) => {
  const body = JSON.stringify(params);

  return api({
    input: `${BACKEND_URL}/create`,
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

export const loadDictionary = (dictionary: DICTIONARIES) => {
  return api({
    // TODO: подключить реальное api
    input: `/mock/${dictionary}.json`,
    init: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  });
};
