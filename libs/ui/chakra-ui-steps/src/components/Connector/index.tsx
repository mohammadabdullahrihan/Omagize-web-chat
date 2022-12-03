import { chakra, HTMLChakraProps, ThemingProps, useStyles } from '@chakra-ui/system';
import * as React from 'react';
import { useStepsContext } from '../../context';
import { dataAttr } from '../Step';

interface ConnectorProps extends HTMLChakraProps<'div'>, ThemingProps {
  isCompletedStep: boolean;
  isLastStep?: boolean;
  hasLabel?: boolean;
  index: number;
}

export const Connector = React.memo(
  ({ index, isCompletedStep, children, isLastStep, hasLabel }: ConnectorProps) => {
    const { connector, stepIconContainer } = useStyles();
    const { isVertical, isLabelVertical, widths } = useStepsContext();

    const getMargin = () => {
      if (isVertical) return `calc(${stepIconContainer.width} / 2)`;
      if (!hasLabel) return 2;
      return 0;
    };

    const styles = React.useMemo(() => {
      const base = {
        ms: getMargin(),
        my: isVertical ? 2 : 0,
        ps: isVertical ? 4 : 0,
        me: isVertical || isLabelVertical ? 0 : 2,
        height: isVertical ? 'auto' : '2px',
        alignSelf: isVertical ? 'stretch' : 'auto',
        borderTopWidth: isLastStep || isVertical ? 0 : '2px',
        borderInlineStartWidth: isLastStep || !isVertical ? 0 : '2px',
        minHeight: isLastStep || !isVertical ? 'auto' : '1.5rem',
      };
      if (isLabelVertical) {
        return {
          ...base,
          position: 'absolute',
          top: `calc(${stepIconContainer.height} / 2  - ${base.height} / 2)`,
          left: `calc(((${widths?.[index]}px + ${stepIconContainer.width}) / 2) + 8px)`,
          // use index of next step to determine spacing
          right: `calc((${widths?.[index + 1]}px - ${stepIconContainer.width}) / -2 + 8px)`,
        };
      }
      return base;
    }, [widths, isLabelVertical, isVertical, stepIconContainer.height, stepIconContainer.width]);

    return (
      <chakra.div
        __css={{
          ...styles,
          ...connector,
        }}
        data-highlighted={dataAttr(isCompletedStep)}
      >
        {isVertical && children}
      </chakra.div>
    );
  }
);
