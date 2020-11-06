import React, { Fragment } from "react";
import Sidebar from "./Containers/Sidebar";
import MainContent from "./Containers/MainContent/MainContent";
import { ReactComponent as Logo } from "./../../assets/svg/logo.svg";
import { Link } from "react-router-dom";
import { FiGithub, FiGitlab, FiLinkedin } from "react-icons/fi";
import { GrMedium } from "react-icons/gr";

function Layout() {
  return (
    <Fragment>
      <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light d-none d-md-block">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <Logo />
          </Link>
          <strong className="text-center text-bold">Let's get in touch!</strong>
          <div className="row text-center">
            <div className="col">
              <a href="/" className="btn-white">
                <FiGithub size="25" />
              </a>
              <a
                href="https://gitlab.com/obenjrtaib"
                className="btn-white ml-4"
              >
                <FiGitlab size="25" />
              </a>
              <a
                href="https://gitlab.com/obenjrtaib"
                className="btn-white ml-4"
              >
                <GrMedium size="25" />
              </a>
              <a href="/" className="btn-white ml-4">
                <FiLinkedin size="25" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="main-content">
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <MainContent />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Layout;
