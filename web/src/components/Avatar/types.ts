import type { ReactElement } from 'react';

import type { AvatarFullConfig } from 'react-nice-avatar';

export const defaultColors = {
  faceColors: ['#AC6651', '#F9C9B6'],
  hairColors: ['#000', '#FFFFFF', '#D2EFF3', '#FC909F'],
  bgColors: ['#E0DDFF', '#F4D150', '#F48150'],
  hatColors: ['#000', '#D2EFF3', '#FC909F'],
  shirtColors: ['#F9C9B6', '#FFFFFF', '#77311D'],
} as const;

export type FaceColor = typeof defaultColors.faceColors[number];
export type HairColor = typeof defaultColors.hairColors[number];
export type BgColor = typeof defaultColors.bgColors[number];
export type HatColor = typeof defaultColors.hatColors[number];
export type ShirtColor = typeof defaultColors.shirtColors[number];

export interface AvatarConfig
  extends Required<
    Pick<
      AvatarFullConfig,
      | 'hairStyle'
      | 'hatStyle'
      | 'eyeStyle'
      | 'glassesStyle'
      | 'earSize'
      | 'noseStyle'
      | 'mouthStyle'
      | 'shirtStyle'
      | 'shirtColor'
    >
  > {
  faceColor: FaceColor;
  hairColor: HairColor;
  bgColor: BgColor;
  hatColor: HatColor;
  shirtColor: ShirtColor;
}

export type AvatarConfigColorTypes = Pick<
  AvatarConfig,
  'faceColor' | 'hairColor' | 'hatColor' | 'bgColor' | 'shirtColor'
>;

export type AvatarConfigWithoutColors = Omit<
  AvatarConfig,
  'faceColor' | 'hairColor' | 'hatColor' | 'bgColor' | 'shirtColor'
>;

type SettingsVariants<T> = Array<{
  value: T;
  view: ReactElement;
}>;

export type SettingsItems = {
  [key in keyof AvatarConfig]: {
    currentValue: AvatarConfig[key];
    allVariants: SettingsVariants<AvatarConfig[key]>;
  };
};
