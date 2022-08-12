import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import NiceAvatar, { genConfig } from 'react-nice-avatar';
import type {
  NiceAvatarProps,
  Style,
  AvatarFullConfig,
} from 'react-nice-avatar';

import { observer } from 'mobx-react-lite';

import { selectRandomIndex } from 'utils';

import { defaultColors } from './types';
import type { AvatarConfigColorTypes } from './types';

export interface AvatarProps {
  size: number;
  config: NiceAvatarProps;
  round?: boolean;
}

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

export const Avatar: FunctionComponent<AvatarProps> = observer(
  ({ size, config, round = true }) => {
    const style = useMemo<Style>(
      () => ({
        width: size,
        height: size,
        borderRadius: round ? '100%' : '8px',
      }),
      [size, round],
    );

    return <NiceAvatar style={style} {...genDefaultConfig(config)} />;
  },
);

Avatar.displayName = 'Avatar';
