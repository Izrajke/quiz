import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import ReactTooltip, { TooltipProps } from 'react-tooltip';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Tooltip.module.css';

export interface RTooltipProps extends TooltipProps {
  className?: string;
  tooltipText: string;
}

export const Tooltip: FunctionComponent<RTooltipProps> = observer(
  ({ children, className, id, tooltipText, ...props }) => {
    const style = useMemo(() => clsx(classes.tooltop, className), [className]);

    return (
      <>
        <span data-tip data-for={id}>
          {children}
        </span>
        <ReactTooltip
          id={id}
          className={style}
          type="light"
          effect="solid"
          {...props}
        >
          {tooltipText}
        </ReactTooltip>
      </>
    );
  },
);

Tooltip.displayName = 'Tooltip';
