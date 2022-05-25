import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import NiceAvatar, { genConfig } from 'react-nice-avatar';
import type {
  NiceAvatarProps,
  Style,
  AvatarFullConfig,
} from 'react-nice-avatar';

import { AvatarConfigColorTypes } from './types';

import { observer } from 'mobx-react-lite';

export interface AvatarProps {
  size: number;
  config?: NiceAvatarProps;
  round?: boolean;
}

type DefaultConfig =
  | Pick<AvatarFullConfig, 'sex' | 'eyeBrowStyle'>
  | AvatarConfigColorTypes;

// TODO: рандомно устанавливать цвета
export const DEFAULT_CONFIG: DefaultConfig = {
  sex: 'man',
  faceColor: '#AC6651',
  hairColor: '#000',
  bgColor: '#E0DDFF',
  hatColor: '#000',
  shirtColor: '#F9C9B6',
  eyeBrowStyle: 'up',
};

export const genDefaultConfig = (
  config: AvatarFullConfig = { ...genConfig(DEFAULT_CONFIG) },
) => ({
  ...genConfig(config),
});

export const Avatar: FunctionComponent<AvatarProps> = observer(
  ({ size, config = genDefaultConfig(), round = true }) => {
    const style = useMemo<Style>(
      () => ({
        width: size,
        height: size,
        borderRadius: round ? '100%' : '8px',
      }),
      [size, round],
    );

    return <NiceAvatar style={style} {...config} />;
  },
);

Avatar.displayName = 'Avatar';
