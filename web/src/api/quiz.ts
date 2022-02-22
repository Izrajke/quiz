import { api, BACKEND_URL } from 'api';

export const createLobby = async () => {
  const data = await api({
    input: `${BACKEND_URL}/create`,
    init: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  });

  return data;
};
