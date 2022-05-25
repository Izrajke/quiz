import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import NiceAvatar, { genConfig } from 'react-nice-avatar';
import type { NiceAvatarProps, Style } from 'react-nice-avatar';

import { observer } from 'mobx-react-lite';

export interface AvatarProps {
  size: number;
  config?: NiceAvatarProps;
  round?: boolean;
}

type DefaultConfig = Pick<NiceAvatarProps, 'sex'>;

export const DEFAULT_CONFIG: DefaultConfig = {
  sex: 'man',
};

export const Avatar: FunctionComponent<AvatarProps> = observer(
  ({ size, config = { ...genConfig(), ...DEFAULT_CONFIG }, round = true }) => {
    const style = useMemo<Style>(
      () => ({
        width: size,
        height: size,
        borderRadius: round ? '100%' : '8px',
      }),
      [size, round],
    );

    const props = useMemo(() => ({ ...config, ...DEFAULT_CONFIG }), [config]);

    return <NiceAvatar style={style} {...props} />;
  },
);

Avatar.displayName = 'Avatar';
