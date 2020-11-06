import React, { useEffect, useState, useRef } from "react";
import {
  gql,
  useLazyQuery,
  useSubscription,
  useMutation,
} from "@apollo/client";
import { useMessageState } from "../../../../../context/message";
import MessageCard from "../../Components/MessageCard";
import LoadingProgress from "../../Components/LoadingProgress";
import chatSound from "./../../../../../assets/sounds/chat.mp3";
import useSound from "use-sound";

const SET_SEEN = gql`
  mutation setSeen($to: ID!) {
    setSeen(to: $to) {
      is
    }
  }
`;
const IS_SEEN = gql`
  subscription {
    setSeen {
      is
    }
  }
`;
const START_TYPING = gql`
  subscription {
    startTyping {
      is
    }
  }
`;
const STOPED_TYPING = gql`
  subscription {
    stopedTyping {
      is
    }
  }
`;
const GET_CONVERSATION_MESSAGES = gql`
  query getMessages($from: ID!, $start: Int!, $limit: Int!) {
    getMessages(from: $from, start: $start, limit: $limit) {
      from
      to
      content
      seen
      createdAt
      Image {
        filename
        path
      }
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription {
    newMessage {
      from
      to
      content
      seen
      createdAt
      Image {
        filename
        path
      }
    }
  }
`;

export default function ChatContentBody() {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };
  const [playSound] = useSound(chatSound, { volume: 0.5 });
  const me = localStorage.getItem("_id");
  const { selectedConversation } = useMessageState();
  const [isTyping, setTyping] = useState(false);
  const [isSeen, setSeen] = useState(false);
  const { sendingMsgs } = useMessageState();
  //
  const { data: startTypingData } = useSubscription(START_TYPING);
  const { data: stopedTypingData } = useSubscription(STOPED_TYPING);
  //
  const { data: isSeenData } = useSubscription(IS_SEEN);
  //
  const [setSeenData] = useMutation(SET_SEEN);
  //
  const { data: newMessage } = useSubscription(NEW_MESSAGE);
  //
  const [getMessages, { data: messagesData, loading }] = useLazyQuery(
    GET_CONVERSATION_MESSAGES
  );
  const [msgsLists, setMsgs] = useState(null);
  const [newMessagesList, setNewMessages] = useState(null);
  useEffect(() => {
    setNewMessages(null);
    setMsgs(null);
  }, [selectedConversation]);
  /**
   * When the person open the message we have to
   * set is as seen
   */
  useEffect(() => {
    if (isSeenData) {
      setSeen(true);
    }
  }, [isSeenData]);
  /**
   * check the person is currently typing is it's true
   * remove typing else set as the person typing
   */
  useEffect(() => {
    if (startTypingData) {
      setTyping(true);
    }
  }, [startTypingData]);
  useEffect(() => {
    if (stopedTypingData) {
      setTyping(false);
    }
  }, [stopedTypingData]);
  /**
   * if the person start typing that's means
   * he saw the message
   * update the all messages as seen
   */
  // useEffect(() => {

  // }, [isTypingData]);
  /***
   * for update the use seen message!
   */
  useEffect(() => {
    if (
      newMessage &&
      newMessage.newMessage.from === selectedConversation.user._id
    ) {
      setSeenData({
        variables: { to: selectedConversation.user._id },
      });
    }
    if (!newMessage && selectedConversation.user._id) {
      setSeenData({
        variables: { to: selectedConversation.user._id },
      });
    }
  }, [newMessage, setSeenData, selectedConversation]);
  /**
   *
   *
   *
   *
   *
   */
  useEffect(() => {
    if (newMessage) {
      if (newMessage.newMessage.from !== me) {
        playSound();
      }
    }
  }, [newMessage, me, playSound]);
  useEffect(() => {
    /**
     * we got new message so add this message to the new messages list
     * and update the seen status
     */
    if (newMessage) {
      const newMessages = newMessagesList ? newMessagesList : [];
      newMessages.push(newMessage.newMessage);
      setNewMessages(newMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);
  useEffect(() => {
    /**
     * WE got the messages with this converstion
     */
    if (messagesData !== undefined) {
      const data = messagesData.getMessages;
      const payload = data.slice().sort(() => {
        return -1;
      });
      setMsgs(payload);
    }
  }, [messagesData]);
  /**
   * get the messages with this user
   */
  useEffect(() => {
    if (selectedConversation.user._id) {
      getMessages({
        variables: { from: selectedConversation.user._id, start: 0, limit: 10 },
      });
    }
  }, [selectedConversation, getMessages]);
  /***
   * scroll to buttom everytime the something change
   */
  useEffect(() => scrollToBottom());
  return (
    <div className="list-group list-group-flush list-group-activity my-n3">
      {loading && <LoadingProgress />}
      {!loading &&
        msgsLists &&
        msgsLists.map((item, index) => (
          <MessageCard
            key={index}
            item={item}
            sendingMsg={false}
            isSeen={isSeen}
          />
        ))}
      {!loading &&
        newMessagesList &&
        newMessagesList.map((item, index) => (
          <MessageCard
            key={index}
            item={item}
            sendingMsg={false}
            isSeen={isSeen}
          />
        ))}
      {sendingMsgs &&
        sendingMsgs.map((item, index) => (
          <MessageCard key={index} item={item} sendingMsg={true} />
        ))}
      {isTyping && (
        <MessageCard item={selectedConversation.user} isTyping={true} />
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
}
