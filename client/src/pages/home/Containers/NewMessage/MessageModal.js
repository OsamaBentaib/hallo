import React, { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { gql, useLazyQuery } from "@apollo/client";
import LoadingProgress from "../Components/LoadingProgress";
import * as actionTypes from "../../../../context/actionTypes";
import { useMessageDispatch } from "../../../../context/message";

const GET_USERS = gql`
  query getUsers($keyword: String!) {
    getUsers(keyword: $keyword) {
      username
      _id
    }
  }
`;
export default function MessageModal(props) {
  const dispatch = useMessageDispatch();
  const [users, setUsers] = useState();
  const [keyword, setKeyword] = useState("");
  const [getUsers, { data: usersData, loading }] = useLazyQuery(GET_USERS);
  useEffect(() => {
    if (!users) {
      getUsers({
        variables: { keyword: "" },
      });
    }
  });
  useEffect(() => {
    if (usersData) {
      setUsers(usersData.getUsers);
    }
  }, [usersData]);
  const onSearch = (keyword) => {
    setKeyword(keyword);
    getUsers({
      variables: { keyword: keyword },
    });
  };
  const onTap = (e) => {
    dispatch({
      type: actionTypes.SET_SELECTED_CONVERSATION,
      payload: { user: e },
    });
    props.onClose();
  };
  return (
    <div
      className="modal fade show"
      id="modalMembers"
      tabIndex="-1"
      style={{ display: "block", paddingRight: "17px" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-card card">
            <div className="card-header">
              <h4 className="card-header-title" id="exampleModalCenterTitle">
                Add new message
              </h4>
              <button
                onClick={() => props.onClose()}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span>
                  <FiX />
                </span>
              </button>
            </div>
            <div className="card-header">
              <form>
                <div className="input-group input-group-flush input-group-merge">
                  <input
                    type="search"
                    className="form-control form-control-prepended list-search"
                    placeholder="Search for users"
                    value={keyword}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <span>
                        <FiSearch size="18" />
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush list my-n3">
                {loading && (
                  <div className="mt-4">
                    <LoadingProgress />
                  </div>
                )}
                {users ? (
                  users.length > 0 ? (
                    users.map((user, index) => (
                      <li key={index} className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <a href="../profile-posts.html" className="avatar">
                              <img
                                src={require("./../../../../assets/images/avatar-1.jpg")}
                                alt="..."
                                className="avatar-img rounded-circle"
                              />
                            </a>
                          </div>
                          <div className="col ml-3">
                            <h4 className="mb-1 name">
                              <a href="../profile-posts.html">
                                {user.username}
                              </a>
                            </h4>
                          </div>
                          <div className="col-auto">
                            <button
                              onClick={() => onTap(user)}
                              className="btn btn-white"
                            >
                              Start
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="mt-4 text-center">
                      <p>There's no users</p>
                    </div>
                  )
                ) : (
                  <span></span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
