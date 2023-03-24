import React from 'react';
import { Group, Rect } from 'react-konva';

function Snake(props) {
  return (
    <Group>
        {props.segments.map((segment, index) => (
        <Rect
          key={index}
          x={segment.x}
          y={segment.y}
          width={10}
          height={10}
          fill="green"
        />
      ))}
    </Group>
  );
}

export default Snake;
