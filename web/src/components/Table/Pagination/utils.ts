type PaginationArray = (number | null)[];

export const makeRenderPaginationArray = (
  current: number,
  total: number,
  step = 2,
): PaginationArray => {
  const result: PaginationArray = [];

  for (let i = 1; i <= total; i++) {
    if (i === current || i === 1) {
      result.push(i);
      continue;
    }

    if (i === total) {
      result.push(i);
      break;
    }

    const isInBeforeStep = i < current && current - i <= step;
    const isInAfterStep =
      i > current && current + step - i <= step && current + step - i >= 0;

    if (isInBeforeStep || isInAfterStep) {
      result.push(i);
      continue;
    }

    if (result[result.length - 1] !== null) {
      result.push(null);
    }
  }

  return result;
};
