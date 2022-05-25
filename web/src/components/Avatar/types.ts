import type { ReactElement } from 'react';
import type { AvatarFullConfig } from 'react-nice-avatar';

export type FaceColor = '#AC6651' | '#F9C9B6';
export type HairColor = '#000';
export type BgColor = '#E0DDFF';
export type HatColor = '#000';
export type ShirtColor = '#F9C9B6';

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
