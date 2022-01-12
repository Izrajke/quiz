import type { FunctionComponent } from 'react';
import type { IText } from './Text';
import { Text } from './Text';

interface ITypography extends FunctionComponent {
  Text: IText;
}

export type ITypographyColor = 'white' | 'white-70' | 'disabled';

export const Typography: ITypography = () => null;

Typography.Text = Text;

Typography.displayName = 'Typography';
