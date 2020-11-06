import React, { Fragment, useState } from "react";
import MessageModal from "./MessageModal";
import { FiPlus } from "react-icons/fi";

export default function NewMessage() {
  const [open, openModal] = useState(false);
  const onClose = (e) => {
    openModal(false);
  };
  const onOpen = (e) => {
    openModal(true);
  };
  return (
    <Fragment>
      <button onClick={onOpen} className="small btn link">
        New Message <FiPlus />
      </button>
      {open && <MessageModal onClose={onClose} />}
    </Fragment>
  );
}
