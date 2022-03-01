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

/** Создает тэг style и прокидывает туда анимацию
 * @name - название анимации
 * @context - css свойство
 * @params - парамерты [от ---> до]
 */
export const createAnimationStyle = (
  name: string,
  context: string,
  params: [string, string],
) => {
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
