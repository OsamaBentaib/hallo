import React from "react";
import { ReactComponent as IconFill } from "./../assets/svg/icon_fill.svg";
import { ReactComponent as IconOutline } from "./../assets/svg/icon_outline.svg";
import { ReactComponent as IconRounded } from "./../assets/svg/icon_rounded.svg";
import { ReactComponent as Logo } from "./../assets/svg/logo.svg";
export default function Cover() {
  return (
    <div className="col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block">
      <div className="bg-cover vh-100 auth-cover">
        <div className="text-center">
          <Logo width="200" height="200" />
        </div>
        <div className="text-center">
          <IconFill className="icon-display-1" width="200" height="200" />
          <IconOutline className="icon-display-2" width="200" height="200" />
          <div className="dsplay2">
            <IconRounded className="icon-display-3" width="200" height="200" />
          </div>
        </div>
      </div>
    </div>
  );
}
