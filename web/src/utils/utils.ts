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
