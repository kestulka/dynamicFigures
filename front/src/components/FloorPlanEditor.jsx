import React, { useState } from "react";
import { Stage, Layer, Line, Text, Circle } from "react-konva";

const snapDistance = 15; // Distance within which points will snap together

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const FloorPlanEditor = () => {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [tempLine, setTempLine] = useState([]);
  const [snapPoint, setSnapPoint] = useState(null);

  const handleStageMouseDown = (e) => {
    if (tempLine.length === 0) {
      // Start drawing a new line
      const stage = e.target.getStage();
      const mousePos = stage.getPointerPosition();
      let newPoint = snapToPoint(mousePos.x, mousePos.y);
      setTempLine(newPoint);
    } else {
      // Finish drawing the line
      const newLines = lines.concat([tempLine]);
      setLines(newLines);
      setPoints(points.concat(tempLine));
      setTempLine([]);
      setSnapPoint(null);
    }
  };

  const handleMouseMove = (e) => {
    if (tempLine.length !== 0) {
      const stage = e.target.getStage();
      const mousePos = stage.getPointerPosition();
      let newEndPoint = snapToPoint(mousePos.x, mousePos.y);
      setTempLine([tempLine[0], tempLine[1], ...newEndPoint]);
    }
  };

  const snapToPoint = (x, y) => {
    for (let i = 0; i < points.length; i += 2) {
      const px = points[i];
      const py = points[i + 1];
      const distance = calculateDistance(px, py, x, y);
      if (distance < snapDistance) {
        setSnapPoint([px, py]); // Update snap point position
        return [px, py]; // Snap to this point
      }
    }
    setSnapPoint(null);
    return [x, y];
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleStageMouseDown}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line key={i} points={line} stroke="black" strokeWidth={8} />
        ))}
        {tempLine.length !== 0 && (
          <Line
            points={tempLine}
            stroke="green"
            strokeWidth={8}
            dash={[10, 5]}
          />
        )}
        {snapPoint && (
          <Circle x={snapPoint[0]} y={snapPoint[1]} radius={8} fill="violet" />
        )}
        {lines.map((line, i) => {
          const length = calculateDistance(
            line[0],
            line[1],
            line[2],
            line[3]
          ).toFixed(2);
          return (
            <Text
              key={i}
              x={(line[0] + line[2]) / 2}
              y={(line[1] + line[3]) / 2 - 10}
              text={`${length}px`}
              fontSize={18}
              fontWeight="bolder"
              fill="red"
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default FloorPlanEditor;
