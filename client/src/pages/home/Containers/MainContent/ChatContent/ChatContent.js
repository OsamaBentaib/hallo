import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContentBody from "./ChatContentBody";
import ChatFooter from "./ChatFooter";

export default function ChatContent() {
  const { innerHeight: height } = window;
  return (
    <div className="card border-0 shadow-0">
      <ChatHeader />
      <div
        className="card-body"
        style={{
          overflowX: "hidden",
          overflowY: "scroll",
          height: height - 150,
        }}
      >
        <ChatContentBody />
      </div>
      <div className="card-footer">
        <ChatFooter />
      </div>
    </div>
  );
}
