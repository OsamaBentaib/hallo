import React from "react";

export default function NotSelected() {
  return (
    <div className="flex-column justify-content-center text-center mt-6">
      <div className="container-xxl">
        <div className="avatar avatar-lg mb-5">
          <img
            className="avatar-img rounded-circle"
            src={require("./../../../../assets/images/avatar-1.jpg")}
            alt=""
          />
        </div>
        <h5>
          <strong>Hey {localStorage.getItem("username")}!</strong>
        </h5>
        <p>Please select a chat to start messaging.</p>
      </div>
    </div>
  );
}
