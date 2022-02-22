export const BACKEND_URL = 'http://localhost:8080';

export interface ApiParams {
  /** Информация о запросе */
  input: RequestInfo;
  /** Дополнения к запросу */
  init?: RequestInit;
}

export const api = async ({ input, init }: ApiParams) => {
  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
      },
    });

    if (response.ok) {
      const data = await response['json']();

      return data;
    } else {
      throw Error('error');
    }
  } catch (error) {
    console.log(error);
  }
};
