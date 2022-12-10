import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  isShowing: boolean;
  hide(): void;
};

const Modal = ({ children, isShowing, hide }: Props) => {
  const [close, setClose] = useState(false);
  // useEffect(() => {
  //   window.addEventListener("onkeydown", (e: KeyboardEvent) => {
  //     setClose(true);
  //   });

  //   return () => {};
  // }, []);
  return (
    <>
      {isShowing && (
        <div
          id="modal"
          tabIndex={0}
          onKeyDown={() => console.log("key pressed")}
          className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] bg-opacity-50 transform ${
            close ? "scale-0" : "scale-200"
          }   transition-transform duration-300`}
        >
          <div className="relative">
            <button
              onClick={hide}
              className="absolute right-[10px] top-[5px] text-xl z-10"
            >
              &#10005;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
