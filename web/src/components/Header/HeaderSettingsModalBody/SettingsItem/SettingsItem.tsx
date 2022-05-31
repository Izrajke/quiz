import { useCallback, useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Tooltip } from 'components';
import type { AvatarConfig, AvatarConfigWithoutColors } from 'components';

import { useSettingsContext } from '../HeaderSettingsModalBody';
import { SettingItemIcon } from './SettingItemIcon';

import classes from './SettingsItem.module.css';

export enum SettingsItemTypes {
  color = 'color',
  icon = 'icon',
}

type TooltipText = {
  [key in keyof AvatarConfig]: string;
};

const TOOLTIP_TEXT: TooltipText = {
  shirtColor: 'Цвет одежды',
  hairStyle: 'Прическа',
  bgColor: 'Цвет заднего фона',
  shirtStyle: 'Тип верхней одежды',
  noseStyle: 'Нос',
  mouthStyle: 'Рот',
  hatStyle: 'Головной убор',
  hatColor: 'Цвет головного убора',
  hairColor: 'Цвет волос',
  eyeStyle: 'Глаза',
  glassesStyle: 'Очки',
  faceColor: 'Цвет кожи',
  earSize: 'Уши',
};

interface SettingsItemProps {
  type: SettingsItemTypes;
  itemName: keyof AvatarConfig;
  value: AvatarConfig[keyof AvatarConfig];
}

export const SettingsItem: FunctionComponent<SettingsItemProps> = observer(
  ({ type, value, itemName = null }) => {
    const { onSettingsChange } = useSettingsContext();

    const Content = useCallback(
      () =>
        type === SettingsItemTypes.color ? (
          <div style={{ background: value }} className={classes.colorCircle} />
        ) : (
          <SettingItemIcon
            iconType={itemName as keyof AvatarConfigWithoutColors}
            value={
              value as AvatarConfigWithoutColors[keyof AvatarConfigWithoutColors]
            }
          />
        ),
      [type, value, itemName],
    );

    const clickHandler = useCallback(() => {
      onSettingsChange(itemName as keyof AvatarConfig);
    }, [onSettingsChange, itemName]);

    const tooltipText = useMemo(
      () => (itemName ? TOOLTIP_TEXT[itemName] : ''),
      [itemName],
    );

    return (
      <Tooltip tooltipText={tooltipText} id={tooltipText}>
        <div onClick={clickHandler} className={classes.wrapper}>
          {value !== 'none' ? <Content /> : null}
        </div>
      </Tooltip>
    );
  },
);

SettingsItem.displayName = 'SettingsItem';
