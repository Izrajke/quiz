import type { FunctionComponent } from 'react';

import type { TextComponent } from './Text';
import { Text } from './Text';

interface TypographyComponent extends FunctionComponent {
  Text: TextComponent;
}

export type TypographyColor =
  | 'white'
  | 'white-70'
  | 'white-50'
  | 'disabled'
  | 'dark-2';

export const Typography: TypographyComponent = () => null;

Typography.Text = Text;

Typography.displayName = 'Typography';
