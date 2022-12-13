import React, { useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  isShowing: boolean;
  hide(): void;
  closeButton?: boolean;
};

const Modal = ({ children, isShowing, hide, closeButton }: Props) => {
  return (
    <>
      {isShowing && (
        <div
          id="modal"
          // tabIndex={0}
          // onKeyDown={hide}
          className={`fixed top-0 left-0 z-20 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] bg-opacity-50 transform ${
            isShowing ? "scale-200" : "scale-0"
          }   transition-transform duration-300`}
        >
          <div className="relative">
            {closeButton && (
              <button
                onClick={hide}
                className="absolute right-[10px] top-[5px] text-xl z-30"
              >
                &#10005;
              </button>
            )}
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
