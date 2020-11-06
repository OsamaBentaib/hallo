import React, { Fragment } from "react";
import moment from "moment";

export default function ConversationCard(props) {
  const item = props.item;
  const me = localStorage.getItem("_id");
  return (
    <Fragment>
      <div
        className={`pl-4 pr-2 pt-3 pb-3 mb-n5 border-bottom pointer ${
          props.index !== 0 && "mt-1"
        }`}
        style={{ background: props.isSelected ? "#f5f5f5" : "#fff" }}
        onClick={() => props.onTap(item)}
      >
        <div className="row">
          <div className="media">
            <div className="avatar avatar-sm m-1 mr-4">
              <img
                src={require("./../../../../assets/images/avatar-1.jpg")}
                alt="..."
                className="avatar-img rounded-circle"
              />
            </div>
          </div>
          <div className="media-body overflow-hidden">
            <div className="d-flex align-items-center mb-1">
              <div>
                <strong>{item.user.username} </strong>
                <small className="text-muted">
                  - {moment(item.latestMessage[0].createdAt).fromNow(true)}
                </small>
                {item.badge !== "0" && (
                  <div className="badge badge-primary rounded-circle badge-border-light badge-top-right ml-1">
                    <span>{item.badge}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-truncate">
              <small className="small">
                <strong>{item.latestMessage[0].from === me && "Me: "}</strong>
                {props.item.latestMessage[0]
                  ? props.item.latestMessage[0].content
                    ? props.item.latestMessage[0].content
                    : "type new Message"
                  : "type new Message"}
              </small>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );
}
