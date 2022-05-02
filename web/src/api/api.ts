import { toast } from 'react-toastify';

export const BACKEND_URL = 'http://localhost:8080';

/** Справочники. */
export enum DICTIONARIES {
  /** Типы пака */
  packTypes = 'packTypes',
}

export interface ApiParams {
  /** Информация о запросе */
  input: RequestInfo;
  /** Дополнения к запросу */
  init?: RequestInit;
}

export const api = async <T = unknown>({
  input,
  init,
}: ApiParams): Promise<T | undefined> => {
  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
      },
    });

    if (response.ok) {
      return await response['json']();
    } else {
      toast.error(String(`${response.status} - ${response.statusText}`));
    }
  } catch (error) {
    toast.error('Проблема при подключении к серверу');
  }
};
