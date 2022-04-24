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
