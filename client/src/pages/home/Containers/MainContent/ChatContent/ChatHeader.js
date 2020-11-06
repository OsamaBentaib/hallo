import React from "react";
import { useMessageState } from "../../../../../context/message";

export default function ChatHeader() {
  const { selectedConversation } = useMessageState();
  return (
    <div className="card-header">
      <h4 className="card-header-title">
        {selectedConversation.user.username}
      </h4>
    </div>
  );
}
