import { createContext } from 'react';

import type { HeaderSettingsModalBodyState } from './HeaderSettingsModalBody';

export type SettingsContextProps = Pick<
  HeaderSettingsModalBodyState,
  'onSettingsChange'
>;

export const SettingsContext = createContext<SettingsContextProps | null>(null);
