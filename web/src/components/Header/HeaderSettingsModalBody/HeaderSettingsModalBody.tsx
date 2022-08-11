import { useContext } from 'react';
import type { FunctionComponent, ReactNode } from 'react';

import { toJS } from 'mobx';
import { observer , useLocalObservable } from 'mobx-react-lite';



import { Avatar, DEFAULT_AVATAR_CONFIG, Input, Typography } from 'components';
import type { AvatarConfig, SettingsItems } from 'components';

import type { SettingsModalState } from '../Header';

import { SettingsContext } from './context';
import type { SettingsContextProps } from './context';
import classes from './HeaderSettingsModalBody.module.css';
import { renderSettingsItems } from './utils';

interface HeaderSettingsModalBodyProps
  extends Required<Pick<SettingsModalState, 'nickname' | 'onChangeNickname'>> {
  defaultConfig: AvatarConfig;
  setDefaultConfig: (config: AvatarConfig) => void;
}

export interface HeaderSettingsModalBodyState {
  settingsItems: SettingsItems;
  renderArray: {
    value: AvatarConfig[keyof AvatarConfig];
    view: ReactNode;
  }[];
  onSettingsChange: (key: keyof AvatarConfig) => void;
  config: AvatarConfig;
}

export const HeaderSettingsModalBody: FunctionComponent<HeaderSettingsModalBodyProps> =
  observer(
    ({ nickname, onChangeNickname, defaultConfig, setDefaultConfig }) => {
      const state = useLocalObservable<HeaderSettingsModalBodyState>(() => ({
        settingsItems: renderSettingsItems(defaultConfig),
        get renderArray() {
          return Object.values(this.settingsItems).map(
            ({ allVariants, currentValue }) => {
              const index = allVariants.findIndex(
                (item) => currentValue === item.value,
              );

              return allVariants[index];
            },
          );
        },
        get config() {
          const result = Object.entries(this.settingsItems).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: value.currentValue }),
            {},
          ) as AvatarConfig;

          setDefaultConfig(result);
          return { ...DEFAULT_AVATAR_CONFIG, ...result };
        },
        onSettingsChange(key) {
          const item = toJS(this.settingsItems[key]);

          const index = item.allVariants.findIndex(
            ({ value }) => value === item.currentValue,
          );

          this.settingsItems[key].currentValue =
            item.allVariants[index + 1]?.value || item.allVariants[0].value;
        },
      }));

      return (
        <div className={classes.settings}>
          <Typography.Text color="white-50" type="caption-1">
            Аватар
          </Typography.Text>
          <div className={classes.avatarSettings}>
            <Avatar config={state.config} size={200} round={false} />
            <SettingsContext.Provider
              value={{ onSettingsChange: state.onSettingsChange }}
            >
              <div className={classes.settingsGrid}>
                {state.renderArray.map((item, index) => (
                  <div key={item.value + index}>{item.view}</div>
                ))}
              </div>
            </SettingsContext.Provider>
          </div>
          <Input
            className={classes.input}
            placeholder="123"
            defaultValue={nickname}
            onChange={onChangeNickname}
            label="Никнейм"
          />
        </div>
      );
    },
  );

export const useSettingsContext = () =>
  useContext(SettingsContext) as SettingsContextProps;

HeaderSettingsModalBody.displayName = 'HeaderSettingsModalBody';
