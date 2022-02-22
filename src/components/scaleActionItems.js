import React, { useEffect, useRef, useState } from "react";
import CanvasButton from "./canvasButton";

function ScaleActionItems(props) {
  const { onScaleClick, scaleFactor } = props;

  return (
    <div className="actionItemContainer">
      <label>Scale</label>
      <CanvasButton
        title="100%"
        disabled={scaleFactor === 1}
        onClick={(e) => onScaleClick(100)}
      />
      <CanvasButton
        disabled={scaleFactor === 2}
        title="200%"
        onClick={(e) => onScaleClick(200)}
      />
    </div>
  );
}

export default ScaleActionItems;
