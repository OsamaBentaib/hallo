import React, { useState } from "react";
import { FiSend, FiImage } from "react-icons/fi";
import { gql, useMutation } from "@apollo/client";
import * as actionTypes from "../../../../../context/actionTypes";
import {
  useMessageState,
  useMessageDispatch,
} from "../../../../../context/message";

const SEND_MESSAGE = gql`
  mutation($to: ID!, $content: String!, $createdAt: String!, $Image: Upload) {
    sendMessage(
      to: $to
      content: $content
      createdAt: $createdAt
      Image: $Image
    ) {
      content
      to
      from
      createdAt
      Image {
        filename
        path
        mimetype
      }
    }
  }
`;
const SET_TYPING = gql`
  mutation setTyping($to: ID!, $typing: Boolean!) {
    setTyping(to: $to, typing: $typing) {
      is
    }
  }
`;
export default function ChatFooter() {
  const dispatch = useMessageDispatch();
  const { selectedConversation, sendingMsgs } = useMessageState();
  const [content, setContent] = useState("");
  const [isSent, setSent] = useState(false);
  const [image, setImage] = useState(null);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.error(err),
    onCompleted: () => {
      const remove = sendingMsgs !== undefined ? sendingMsgs : [];
      remove.splice(0, 1);
      dispatch({
        type: actionTypes.SET_SENDING_MESSAGE,
        payload: remove,
      });
    },
  });
  const [setTyping] = useMutation(SET_TYPING);
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" && !image) return;
    if (!selectedConversation.user._id) return;
    setContent("");
    setImage(null);
    if (isSent) {
      setTyping({
        variables: { to: selectedConversation.user._id, typing: false },
      });
      setSent(false);
    }
    const createdAt = new Date().toISOString();
    const newMsg = {
      to: selectedConversation.user._id,
      content: content,
      createdAt: createdAt,
      Image: image,
    };
    const SENDING_MSGS = sendingMsgs !== undefined ? sendingMsgs : [];
    SENDING_MSGS.push(newMsg);
    dispatch({
      type: actionTypes.SET_SENDING_MESSAGE,
      payload: SENDING_MSGS,
    });
    sendMessage({
      variables: newMsg,
    });
  };
  const onType = (e) => {
    setContent(e);
    if (e.length === 1 && !isSent) {
      setTyping({
        variables: { to: selectedConversation.user._id, typing: true },
      });
      setSent(true);
    } else if (e.length === 0 && isSent) {
      setTyping({
        variables: { to: selectedConversation.user._id, typing: false },
      });
      setSent(false);
    }
  };
  /**
   *
   */
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const onSelectEvent = (e) => {
    const image = e.target.files[0];
    Object.assign(image, {
      preview: URL.createObjectURL(image),
    });
    setImage(image);
  };
  return (
    <div className="chat-footer">
      <div className="container-xxl">
        <div className="form-row align-items-center">
          <div className="col">
            <div className="input-group">
              {image && (
                <div
                  className="input-group-append bg-light light p-2"
                  style={{
                    height: 200,
                    borderRadius: 10,
                    marginTop: -150,
                    marginLeft: -20,
                  }}
                >
                  <img
                    style={{ height: "100%", borderRadius: 10 }}
                    src={image.preview}
                    alt="preview..."
                  />
                </div>
              )}
              <textarea
                id="chat-id-1-input"
                className="form-control bg-transparent border-0"
                placeholder="Type your message..."
                rows="1"
                data-emoji-input=""
                data-autosize="true"
                style={{
                  overflow: "hidden",
                  overflowWrap: "break-word",
                  resize: "none",
                  height: "46px",
                }}
                value={content}
                onChange={(e) => onType(e.target.value)}
              ></textarea>
              <div className="input-group-append">
                <input
                  type="file"
                  onChange={onSelectEvent}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
                <button
                  onClick={handleClick}
                  id="chat-upload-btn-1"
                  className="btn text-primary btn-ico btn-secondary btn-minimal bg-transparent border-0 dropzone-button-js dz-clickable"
                  type="button"
                >
                  <FiImage size="19" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <button
              onClick={onSubmitMessage}
              className="btn btn-ico btn-primary rounded-circle"
              type="submit"
            >
              <span>
                <FiSend />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
