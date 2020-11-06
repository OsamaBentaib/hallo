import React, { useState, Fragment } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";
import Cover from "./Cover";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      token
      _id
    }
  }
`;

export default function Signin(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      console.error(err);
      setErrors("Your user with the following doesn't exist");
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5">
            <div className="container">
              <h1 className="display-4 text-center mb-3">Sign in</h1>
              <p className="text-muted text-center mb-5">
                Free access to hallo chat client.
              </p>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="username"
                  value={variables.username}
                  onChange={(e) =>
                    setVariables({ ...variables, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control form-control-appended"
                  placeholder="Enter your password"
                  value={variables.password}
                  onChange={(e) =>
                    setVariables({ ...variables, password: e.target.value })
                  }
                />
              </div>
              {errors && <div className="alert alert-danger">{errors}</div>}

              <button
                onClick={submitLoginForm}
                className={`btn btn-lg btn-block btn-primary mb-3 ${
                  loading && "disabled"
                }`}
                disabled={loading}
              >
                {loading ? "Siggnin in..." : "Sign in"}
              </button>
              <div className="mt-4 mb-2 text-center">
                <Link
                  to="/password_rest/"
                  className="form-text small text-muted"
                >
                  Forgot password?
                </Link>
              </div>
              <p className="text-center">
                <small className="text-muted text-center">
                  Don't have an account yet? <Link to="/signup/">Sign up</Link>.
                </small>
              </p>
            </div>
          </div>
          <Cover />
        </div>
      </div>
    </Fragment>
  );
}
