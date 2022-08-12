import { AvatarFullConfig, genConfig } from 'react-nice-avatar';

import { AvatarConfigColorTypes } from 'components';

export const defaultColors = {
  faceColors: ['#AC6651', '#F9C9B6'],
  hairColors: ['#000', '#FFFFFF', '#D2EFF3', '#FC909F'],
  bgColors: ['#E0DDFF', '#F4D150', '#F48150'],
  hatColors: ['#000', '#D2EFF3', '#FC909F'],
  shirtColors: ['#F9C9B6', '#FFFFFF', '#77311D'],
} as const;

export const selectRandomIndex = <T>(
  arr: Readonly<T[]>,
): typeof arr[number] => {
  const randomIndex = Math.abs(
    Math.round(0 - 0.5 + Math.random() * (arr.length + 1)),
  );

  return arr.find((_, index) => index === randomIndex) || arr[0];
};

type DefaultConfig =
  | Pick<AvatarFullConfig, 'sex' | 'eyeBrowStyle'>
  | AvatarConfigColorTypes;

export const DEFAULT_AVATAR_CONFIG: DefaultConfig = {
  sex: 'man',
  faceColor: selectRandomIndex(defaultColors.faceColors),
  hairColor: selectRandomIndex(defaultColors.hairColors),
  bgColor: selectRandomIndex(defaultColors.bgColors),
  hatColor: selectRandomIndex(defaultColors.hatColors),
  shirtColor: selectRandomIndex(defaultColors.shirtColors),
  eyeBrowStyle: 'up',
};

export const genDefaultConfig = (
  config: AvatarFullConfig = { ...genConfig(DEFAULT_AVATAR_CONFIG) },
) => ({
  ...genConfig({ ...DEFAULT_AVATAR_CONFIG, ...config }),
});
