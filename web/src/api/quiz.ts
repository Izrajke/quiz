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
    input: `${BACKEND_URL}/api/category/${dictionary}`,
    init: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  });
};

export interface LibraryItem {
  title: string;
  id: string;
  category: string;
  rating: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
}

export interface LibraryResponse {
  content: LibraryItem[];
  pagination: PaginationResponse;
}

export const loadLibrary = (page: number) => {
  const body = JSON.stringify({ page });

  return api<LibraryResponse>({
    input: `${BACKEND_URL}/api/pack/filter`,
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
