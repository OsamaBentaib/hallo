import React from "react";
import { FiArrowRight, FiClock, FiMoreHorizontal } from "react-icons/fi";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { useMessageState } from "../../../../context/message";
import moment from "moment";
import { PROXY } from "../../../../constants/constants";

export default function MessageCard(props) {
  const item = props.item;
  const { selectedConversation } = useMessageState();
  const me = localStorage.getItem("_id");
  const isSeen = props.isSeen;
  if (props.sendingMsg) {
    return (
      <div className="list-group-item msg-card">
        <div className="row">
          <div className="col-auto ml-3">
            <div className="avatar avatar-sm mr-3">
              <div className="avatar-title font-size-lg bg-primary-soft rounded-circle text-muted">
                <FiClock size="14" />
              </div>
            </div>
          </div>
          <div className="col">
            <h5 className="mb-1">Me</h5>
            <p className="small text-gray-700 mb-0">{item.content}</p>
            {item.Image && (
              <div className="w-100">
                <img
                  className="w-100 rounded m-1"
                  src={item.Image.preview}
                  alt="preview..."
                />
              </div>
            )}
            <small className="text-muted">Sending...</small>
          </div>
        </div>
      </div>
    );
  }
  if (props.isTyping) {
    return (
      <div className="list-group-item msg-card">
        <div className="row">
          <div className="col-auto ml-3">
            <div className="avatar avatar-sm mr-3">
              <div className="avatar-title font-size-lg bg-primary-soft rounded-circle text-primary">
                <FiMoreHorizontal />
              </div>
            </div>
          </div>
          <div className="col">
            <h5 className="mb-1">{item.username}</h5>
            <p className="small text-gray-700 mb-0">is typing ...</p>
          </div>
        </div>
      </div>
    );
  }
  if (item.from === me) {
    return (
      <div className="list-group-item msg-card">
        <div className="row">
          <div className="col-auto ml-3">
            <div className="avatar avatar-sm mr-3">
              <div
                className={`avatar-title font-size-lg rounded-circle ${
                  item.seen || isSeen
                    ? "text-primary bg-primary-soft"
                    : "text-muted bg-light-soft border"
                }`}
              >
                {item.seen || isSeen ? <BsCheckAll /> : <BsCheck />}
              </div>
            </div>
          </div>
          <div className="col">
            <h5 className="mb-1">Me </h5>
            <p className="small text-gray-700 mb-0">{item.content}</p>
            {item.Image && item.Image.path && item.Image.filename && (
              <div className="w-100">
                <img
                  className="w-100 rounded m-1"
                  src={PROXY + `images/${item.Image.filename}`}
                  alt="preview..."
                />
              </div>
            )}
            <small className="text-muted">
              {moment(item.createdAt).fromNow(true)}
            </small>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="list-group-item msg-card">
      <div className="row">
        <div className="col-auto ml-3">
          <div className="avatar avatar-sm mr-3">
            <div className="avatar-title font-size-lg bg-primary-soft rounded-circle text-primary">
              <FiArrowRight />
            </div>
          </div>
        </div>
        <div className="col">
          <h5 className="mb-1">{selectedConversation.user.username}</h5>
          <p className="small text-gray-700 mb-0">{item.content}</p>
          {item.Image && item.Image.path && item.Image.filename && (
            <div className="w-100">
              <img
                className="w-100 rounded m-1"
                src={PROXY + `images/${item.Image.filename}`}
                alt="preview..."
              />
            </div>
          )}
          <small className="text-muted">
            {moment(item.createdAt).fromNow(true)}
          </small>
        </div>
      </div>
    </div>
  );
}
