import { format } from 'date-fns';

/** Форматы времени. */
export enum FORMAT_DATE {
  time = 'HH:mm',
  dateTime = 'dd.MM.yyyy, HH:mm',
}

export const formatDate = (
  date: string | number,
  formatDate: FORMAT_DATE = FORMAT_DATE.time,
) => format(new Date(date), formatDate);

/** Вызвать функцию с указанной задержкой */
export const withDelay = <T>(
  func: (...args: T[]) => unknown,
  delay: number,
  args?: T[],
) => {
  setTimeout(() => {
    args ? func(...args) : func();
  }, delay);
};

export interface CreateAnimationStyleArguments {
  /** название анимации */
  name: string;
  /** css свойство */
  context: string;
  /** парамерты анимации [от ---> до] */
  params: [string, string];
}

/** Создает тэг style c @keyframes внутри */
export const createAnimationStyle = ({
  name,
  context,
  params,
}: CreateAnimationStyleArguments) => {
  const [from, to] = params;
  const style = document.createElement('style');

  style.innerHTML = `\
  @-webkit-keyframes ${name} {\
      0% {\
        ${context}: ${from};\
      }\
      100% {\
        ${context}: ${to};\
    }\
  }`;

  return style;
};

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const addToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : null;
};

export const encodeBase64 = (code: string) => JSON.parse(window.atob(code));
