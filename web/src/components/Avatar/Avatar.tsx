import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import NiceAvatar from 'react-nice-avatar';
import type { NiceAvatarProps, Style } from 'react-nice-avatar';

import { observer } from 'mobx-react-lite';

import { genDefaultConfig } from 'utils';

export interface AvatarProps {
  size: number;
  config: NiceAvatarProps;
  round?: boolean;
}

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
