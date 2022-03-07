import { useEffect, useRef, useMemo } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { createAnimationStyle } from '../utils';
import type { CreateAnimationStyleArguments } from '../utils';

type UseAnimation = (
  animationName: string,
  animationStyleParams: Pick<
    CreateAnimationStyleArguments,
    'context' | 'params'
  >,
) => {
  elementRef: RefObject<HTMLDivElement>;
  animationStyle: CSSProperties;
};

export const useAnimation: UseAnimation = (
  animationName,
  animationStyleParams,
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  /** Тэг style с @keyframes внутри */
  const animation = useMemo<HTMLStyleElement>(() => {
    return createAnimationStyle({
      name: animationName,
      ...animationStyleParams,
    });
  }, [animationName, animationStyleParams]);

  useEffect(() => {
    if (elementRef) {
      elementRef.current?.appendChild(animation);
    }
  }, [elementRef, animation]);

  /** Стиль анимации */
  const animationStyle = useMemo<CSSProperties>(
    () => ({
      animation: `${animationName} 3s ease`,
    }),
    [animationName],
  );

  return { elementRef, animationStyle };
};
