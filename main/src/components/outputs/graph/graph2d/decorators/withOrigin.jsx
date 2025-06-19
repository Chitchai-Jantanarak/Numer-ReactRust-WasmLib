import React from 'react';
import { ReferenceLine } from 'recharts';
import { useTheme } from '../../../../../hooks/useTheme';

export function withOrigin(Wrapped) {
  return function OriginChart({ children, graphBound, ...rest }) {
    const { theme } = useTheme();
    const strokeColor = theme === 'light' ? "#000" : "#FFF";

    const enhancedChildren = [
      ...React.Children.toArray(children),
      <ReferenceLine key="origin-x" x={0} stroke={strokeColor} />,
      <ReferenceLine key="origin-y" y={0} stroke={strokeColor} />,
    ];

    return (
      <Wrapped {...rest} graphBound={graphBound}>
        {enhancedChildren}
      </Wrapped>
    );
  };
}
