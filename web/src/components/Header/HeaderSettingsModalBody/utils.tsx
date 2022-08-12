import type { AvatarConfig, SettingsItems } from 'components';

import { SettingsItemTypes , SettingsItem } from './SettingsItem';


export const renderSettingsItems = (config: AvatarConfig): SettingsItems => ({
  shirtColor: {
    currentValue: config.shirtColor,
    allVariants: [
      {
        value: '#F9C9B6',
        view: (
          <SettingsItem
            itemName="shirtColor"
            value="#F9C9B6"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#77311D',
        view: (
          <SettingsItem
            itemName="shirtColor"
            value="#77311D"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#FFFFFF',
        view: (
          <SettingsItem
            itemName="shirtColor"
            value="#FFFFFF"
            type={SettingsItemTypes.color}
          />
        ),
      },
    ],
  },
  faceColor: {
    currentValue: config.faceColor,
    allVariants: [
      {
        value: '#AC6651',
        view: (
          <SettingsItem
            itemName="faceColor"
            value="#AC6651"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#F9C9B6',
        view: (
          <SettingsItem
            itemName="faceColor"
            value="#F9C9B6"
            type={SettingsItemTypes.color}
          />
        ),
      },
    ],
  },
  bgColor: {
    currentValue: config.bgColor,
    allVariants: [
      {
        value: '#E0DDFF',
        view: (
          <SettingsItem
            value="#E0DDFF"
            type={SettingsItemTypes.color}
            itemName="bgColor"
          />
        ),
      },
      {
        value: '#F4D150',
        view: (
          <SettingsItem
            value="#F4D150"
            type={SettingsItemTypes.color}
            itemName="bgColor"
          />
        ),
      },
      {
        value: '#F48150',
        view: (
          <SettingsItem
            value="#F48150"
            type={SettingsItemTypes.color}
            itemName="bgColor"
          />
        ),
      },
    ],
  },
  hatColor: {
    currentValue: config.hatColor,
    allVariants: [
      {
        value: '#000',
        view: (
          <SettingsItem
            value="#000"
            type={SettingsItemTypes.color}
            itemName="hatColor"
          />
        ),
      },
      {
        value: '#D2EFF3',
        view: (
          <SettingsItem
            value="#D2EFF3"
            type={SettingsItemTypes.color}
            itemName="hatColor"
          />
        ),
      },
      {
        value: '#FC909F',
        view: (
          <SettingsItem
            value="#FC909F"
            type={SettingsItemTypes.color}
            itemName="hatColor"
          />
        ),
      },
    ],
  },
  hairColor: {
    currentValue: config.hairColor,
    allVariants: [
      {
        value: '#000',
        view: (
          <SettingsItem
            itemName="hairColor"
            value="#000"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#FFFFFF',
        view: (
          <SettingsItem
            itemName="hairColor"
            value="#FFFFFF"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#D2EFF3',
        view: (
          <SettingsItem
            itemName="hairColor"
            value="#D2EFF3"
            type={SettingsItemTypes.color}
          />
        ),
      },
      {
        value: '#FC909F',
        view: (
          <SettingsItem
            itemName="hairColor"
            value="#FC909F"
            type={SettingsItemTypes.color}
          />
        ),
      },
    ],
  },
  shirtStyle: {
    currentValue: config.shirtStyle,
    allVariants: [
      {
        value: 'hoody',
        view: (
          <SettingsItem
            value="hoody"
            type={SettingsItemTypes.icon}
            itemName="shirtStyle"
          />
        ),
      },
      {
        value: 'short',
        view: (
          <SettingsItem
            value="short"
            type={SettingsItemTypes.icon}
            itemName="shirtStyle"
          />
        ),
      },
      {
        value: 'polo',
        view: (
          <SettingsItem
            value="polo"
            type={SettingsItemTypes.icon}
            itemName="shirtStyle"
          />
        ),
      },
    ],
  },

  noseStyle: {
    currentValue: config.noseStyle,
    allVariants: [
      {
        value: 'round',
        view: (
          <SettingsItem
            value="round"
            type={SettingsItemTypes.icon}
            itemName="noseStyle"
          />
        ),
      },
      {
        value: 'short',
        view: (
          <SettingsItem
            value="short"
            type={SettingsItemTypes.icon}
            itemName="noseStyle"
          />
        ),
      },
      {
        value: 'long',
        view: (
          <SettingsItem
            value="long"
            type={SettingsItemTypes.icon}
            itemName="noseStyle"
          />
        ),
      },
    ],
  },
  mouthStyle: {
    currentValue: config.mouthStyle,
    allVariants: [
      {
        value: 'smile',
        view: (
          <SettingsItem
            value="smile"
            type={SettingsItemTypes.icon}
            itemName="mouthStyle"
          />
        ),
      },
      {
        value: 'laugh',
        view: (
          <SettingsItem
            value="laugh"
            type={SettingsItemTypes.icon}
            itemName="mouthStyle"
          />
        ),
      },
      {
        value: 'peace',
        view: (
          <SettingsItem
            value="peace"
            type={SettingsItemTypes.icon}
            itemName="mouthStyle"
          />
        ),
      },
    ],
  },
  hatStyle: {
    currentValue: config.hatStyle,
    allVariants: [
      {
        value: 'turban',
        view: (
          <SettingsItem
            value="turban"
            type={SettingsItemTypes.icon}
            itemName="hatStyle"
          />
        ),
      },
      {
        value: 'beanie',
        view: (
          <SettingsItem
            value="beanie"
            type={SettingsItemTypes.icon}
            itemName="hatStyle"
          />
        ),
      },
      {
        value: 'none',
        view: (
          <SettingsItem
            value="none"
            type={SettingsItemTypes.icon}
            itemName="hatStyle"
          />
        ),
      },
    ],
  },
  earSize: {
    currentValue: config.earSize,
    allVariants: [
      {
        value: 'small',
        view: (
          <SettingsItem
            value="small"
            type={SettingsItemTypes.icon}
            itemName="earSize"
          />
        ),
      },
      {
        value: 'big',
        view: (
          <SettingsItem
            value="big"
            type={SettingsItemTypes.icon}
            itemName="earSize"
          />
        ),
      },
    ],
  },
  glassesStyle: {
    currentValue: config.glassesStyle,
    allVariants: [
      {
        value: 'square',
        view: (
          <SettingsItem
            value="square"
            type={SettingsItemTypes.icon}
            itemName="glassesStyle"
          />
        ),
      },
      {
        value: 'round',
        view: (
          <SettingsItem
            value="round"
            type={SettingsItemTypes.icon}
            itemName="glassesStyle"
          />
        ),
      },
      {
        value: 'none',
        view: (
          <SettingsItem
            value="none"
            type={SettingsItemTypes.icon}
            itemName="glassesStyle"
          />
        ),
      },
    ],
  },
  eyeStyle: {
    currentValue: config.eyeStyle,
    allVariants: [
      {
        value: 'oval',
        view: (
          <SettingsItem
            value="oval"
            type={SettingsItemTypes.icon}
            itemName="eyeStyle"
          />
        ),
      },
      {
        value: 'circle',
        view: (
          <SettingsItem
            value="circle"
            type={SettingsItemTypes.icon}
            itemName="eyeStyle"
          />
        ),
      },
      {
        value: 'smile',
        view: (
          <SettingsItem
            value="smile"
            type={SettingsItemTypes.icon}
            itemName="eyeStyle"
          />
        ),
      },
    ],
  },
  hairStyle: {
    currentValue: config.hairStyle,
    allVariants: [
      {
        value: 'thick',
        view: (
          <SettingsItem
            value="thick"
            type={SettingsItemTypes.icon}
            itemName="hairStyle"
          />
        ),
      },
      {
        value: 'mohawk',
        view: (
          <SettingsItem
            value="mohawk"
            type={SettingsItemTypes.icon}
            itemName="hairStyle"
          />
        ),
      },
      {
        value: 'normal',
        view: (
          <SettingsItem
            value="normal"
            type={SettingsItemTypes.icon}
            itemName="hairStyle"
          />
        ),
      },
      {
        value: 'womanShort',
        view: (
          <SettingsItem
            value="womanShort"
            type={SettingsItemTypes.icon}
            itemName="hairStyle"
          />
        ),
      },
      {
        value: 'womanLong',
        view: (
          <SettingsItem
            value="womanLong"
            type={SettingsItemTypes.icon}
            itemName="hairStyle"
          />
        ),
      },
    ],
  },
});
