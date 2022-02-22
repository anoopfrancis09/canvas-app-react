import React from "react";
import { infoMessageDrag, infoMessageDoubleClick } from "../constants";

function MessageContainer() {
  return (
    <div className="messagesContainer">
      <label className="messages" id="messagesLabel">
        {infoMessageDrag}
      </label>
      <label className="messages" id="messagesLabel">
        {infoMessageDoubleClick}
      </label>
    </div>
  );
}

export default MessageContainer;
