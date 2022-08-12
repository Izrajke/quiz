import { createElement, CSSProperties, useMemo } from 'react';
import type { FunctionComponent, SVGProps } from 'react';

import { observer } from 'mobx-react-lite';

import type { AvatarConfigWithoutColors } from 'components';

import classes from './SettingsItem.module.css';
import { ReactComponent as Beanie } from './svg/Beanie.svg';
import { ReactComponent as EarBig } from './svg/EarBig.svg';
import { ReactComponent as EarSmall } from './svg/EarSmall.svg';
import { ReactComponent as EyeCircle } from './svg/EyeCircle.svg';
import { ReactComponent as EyeOval } from './svg/EyeOval.svg';
import { ReactComponent as EyeSmile } from './svg/EyeSmile.svg';
import { ReactComponent as GlassesRound } from './svg/GlassesRound.svg';
import { ReactComponent as GlassesSquare } from './svg/GlassesSquare.svg';
import { ReactComponent as HairMohawk } from './svg/HairMohawk.svg';
import { ReactComponent as HairNormal } from './svg/HairNormal.svg';
import { ReactComponent as HairThick } from './svg/HairThick.svg';
import { ReactComponent as HairWomanLong } from './svg/HairWomanLong.svg';
import { ReactComponent as HairWomanShort } from './svg/HairWomanShort.svg';
import { ReactComponent as MouthLaugh } from './svg/MouthLaugh.svg';
import { ReactComponent as MouthPeace } from './svg/MouthPeace.svg';
import { ReactComponent as MouthSmile } from './svg/MouthSmile.svg';
import { ReactComponent as NoseLong } from './svg/NoseLong.svg';
import { ReactComponent as NoseRound } from './svg/NoseRound.svg';
import { ReactComponent as NoseShort } from './svg/NoseShort.svg';
import { ReactComponent as ShirtHoody } from './svg/ShirtHoody.svg';
import { ReactComponent as ShirtPolo } from './svg/ShirtPolo.svg';
import { ReactComponent as ShirtShort } from './svg/ShirtShort.svg';
import { ReactComponent as Turban } from './svg/Turban.svg';

type IconData = {
  [key in keyof AvatarConfigWithoutColors]: {
    [T in AvatarConfigWithoutColors[key]]: FunctionComponent<
      SVGProps<SVGSVGElement>
    > | null;
  };
};

const icons: IconData = {
  earSize: {
    big: EarBig,
    small: EarSmall,
  },
  eyeStyle: {
    circle: EyeCircle,
    oval: EyeOval,
    smile: EyeSmile,
  },
  hatStyle: {
    turban: Turban,
    beanie: Beanie,
    none: null,
  },
  glassesStyle: {
    round: GlassesRound,
    square: GlassesSquare,
    none: null,
  },
  mouthStyle: {
    smile: MouthSmile,
    laugh: MouthLaugh,
    peace: MouthPeace,
  },
  noseStyle: {
    round: NoseRound,
    long: NoseLong,
    short: NoseShort,
  },
  shirtStyle: {
    short: ShirtShort,
    hoody: ShirtHoody,
    polo: ShirtPolo,
  },
  hairStyle: {
    mohawk: HairMohawk,
    normal: HairNormal,
    thick: HairThick,
    womanLong: HairWomanLong,
    womanShort: HairWomanShort,
  },
};

interface SettingItemIconProps {
  iconType: keyof AvatarConfigWithoutColors;
  value: AvatarConfigWithoutColors[keyof AvatarConfigWithoutColors];
}

export const SettingItemIcon: FunctionComponent<SettingItemIconProps> =
  observer(({ iconType, value }) => {
    const style = useMemo<CSSProperties>(
      () => ({
        width: 20,
        height: 20,
      }),
      [],
    );

    // eslint-disable-next-line
    // @ts-ignore
    const element = createElement(icons[iconType][value], {
      style,
    });

    return <div className={classes.icon}>{element}</div>;
  });

SettingItemIcon.displayName = 'SettingItemIcon';
