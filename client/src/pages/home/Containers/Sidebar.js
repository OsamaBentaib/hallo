import React, { useCallback, useEffect } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";
import * as actionTypes from "../../../context/actionTypes";
import { useMessageDispatch, useMessageState } from "../../../context/message";
import { FiLogOut } from "react-icons/fi";
import ConversationCard from "./Components/ConversationCard";
import ConversationCardLoading from "./Components/ConversationCardLoading";
import { useAuthDispatch } from "../../../context/auth";
import NewMessage from "./NewMessage/NewMessage";
const GET_CONVERSATIONS = gql`
  query getConversations {
    getConversations {
      user {
        username
        _id
      }
      latestMessage {
        content
        createdAt
        from
      }
      badge
    }
  }
`;
const GET_NEW_CONVERSATIONS = gql`
  subscription {
    newConversation {
      user {
        username
      }
      latestMessage {
        content
        createdAt
        from
      }
      badge
    }
  }
`;
export default function Sidebar() {
  const { innerHeight: height } = window;
  const dispatch = useMessageDispatch();
  const { conversations, selectedConversation } = useMessageState();
  const { data: newConvData } = useSubscription(GET_NEW_CONVERSATIONS);
  const { loading } = useQuery(GET_CONVERSATIONS, {
    onCompleted: (data) => {
      const convData = data.getConversations.filter(function (ele) {
        return ele !== null;
      });
      const payload = convData.slice().sort(() => {
        return -1;
      });
      dispatch({
        type: actionTypes.SET_CONVERSATIONS,
        payload: payload,
      });
    },
    onError: (err) => console.error(err),
  });
  // new message and the conversation shoud be in the top
  /**
   * if th
   */
  const renewConv = useCallback(
    (newConvData) => {
      if (newConvData) {
        /**
         * remove the old message trhat we had we that person
         */
        const newConv = conversations.filter((e) => {
          return e.user.username !== newConvData.newConversation.user.username;
        });
        /**
         * add the new message
         */
        newConv.push(newConvData.newConversation);
        const payload = newConv.slice().sort(() => {
          return -1;
        });
        dispatch({
          type: actionTypes.SET_CONVERSATIONS,
          payload: payload,
        });
      }
    },
    [conversations, dispatch]
  );
  useEffect(() => {
    if (newConvData) renewConv(newConvData ? newConvData : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newConvData]);
  /**
   *
   *
   */
  const onTap = (e) => {
    dispatch({
      type: actionTypes.SET_CONVERSATION_MESSAGES,
      payload: [],
    });
    dispatch({
      type: actionTypes.SET_SELECTED_CONVERSATION,
      payload: e,
    });
    dispatch({
      type: actionTypes.CONV_LOADING,
      payload: true,
    });
  };
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/signin/";
  };
  return (
    <div
      className={`col-12 col-xl-4 border-right ${
        selectedConversation && "d-none d-xl-block"
      }`}
      style={{
        height: height,
        background: "#fff",
        borderRadius: "0px !important",
      }}
    >
      <div
        className="card border-0 shadow-0 w-100"
        style={{ width: "100% !important", height: "100%" }}
      >
        <div className="card-header">
          <h4 className="card-header-title">Messages</h4>
          <NewMessage />
        </div>
        <div
          style={{
            overflowX: "hidden",
            overflowY: "scroll",
            height: height - 150,
          }}
        >
          <div className="list-group list-group-flush">
            {loading && <ConversationCardLoading />}
            {!loading &&
              conversations !== undefined &&
              conversations.map((item, index) => (
                <ConversationCard
                  isSelected={
                    selectedConversation !== undefined &&
                    selectedConversation.user === item.user
                      ? true
                      : false
                  }
                  index={index}
                  onTap={onTap}
                  key={index}
                  item={item}
                />
              ))}
          </div>
        </div>
        <div className="card-footer">
          <div className="row align-items-center">
            <div className="col-auto">
              <a href="profile-posts.html" className="avatar">
                <img
                  src={require("./../../../assets/images/avatar-1.jpg")}
                  alt="..."
                  className="avatar-img rounded-circle"
                />
              </a>
            </div>
            <div className="col ml-3">
              <h4 className="mb-1">
                <strong>{localStorage.getItem("username")}</strong>
              </h4>
              <p className="small mb-0">
                <span className="text-success">●</span> Online
              </p>
            </div>
            <div className="col-auto">
              <div className="dropdown">
                <button onClick={logout} className="btn text-danger">
                  <FiLogOut />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
