/** Вызвать функцию с указанной задержкой */
export const withDelay = (func: any, delay: number, args?: any[]) => {
  setTimeout(() => {
    args ? func(...args) : func();
  }, delay);
};
