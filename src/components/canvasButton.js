/* eslint-disable no-fallthrough */
import React from "react";

function CanvasButton(props) {
  const { title, disabled, onClick } = props;

  return (
    <button
      disabled={disabled}
      type="button"
      className="button"
      id="myBtn"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default CanvasButton;
