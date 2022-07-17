import { makeRenderPaginationArray } from './utils';

const defaultStep = 2;

describe('makeRenderPaginationArray', () => {
  it('Пагинация с одной страницей', () => {
    const pagination = makeRenderPaginationArray(1, 1, defaultStep);

    expect(pagination).toEqual([1]);
  });

  it('Пагинация 5 страницами, с текущей 1', () => {
    const pagination = makeRenderPaginationArray(1, 5, defaultStep);

    expect(pagination).toEqual([1, 2, 3, null, 5]);
  });

  it('Пагинация c 45 страницами, с текущей 8', () => {
    const pagination = makeRenderPaginationArray(8, 45, defaultStep);

    expect(pagination).toEqual([1, null, 6, 7, 8, 9, 10, null, 45]);
  });

  it('Пагинация c 45 страницами, с текущей 45', () => {
    const pagination = makeRenderPaginationArray(45, 45, defaultStep);

    expect(pagination).toEqual([1, null, 43, 44, 45]);
  });

  it('Пагинация c 5 страницами, с текущей 3', () => {
    const pagination = makeRenderPaginationArray(3, 5, defaultStep);

    expect(pagination).toEqual([1, 2, 3, 4, 5]);
  });
});
