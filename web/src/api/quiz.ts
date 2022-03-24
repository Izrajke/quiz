import { api, BACKEND_URL } from 'api';

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
