import React from "react";
import NotSelected from "./NotSelected";
import ChatContent from "./ChatContent/ChatContent";
import { useMessageState } from "../../../../context/message";

export default function MainContent() {
  const { selectedConversation } = useMessageState();
  const { innerHeight: height } = window;
  return (
    <div
      className={`col-12 col-xl-8 border-right ${
        !selectedConversation && "d-none d-xl-block"
      }`}
      style={{ height: height, background: "#fff" }}
    >
      <div className="main">
        {selectedConversation ? <ChatContent /> : <NotSelected />}
      </div>
    </div>
  );
}
