import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  isShowing: boolean;
  hide(): void;
};

const Modal = ({ children, isShowing, hide }: Props) => {
  const [close, setClose] = useState(false);
  return (
    <>
      {isShowing && (
        <div
          id="modal"
          className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.3)] bg-opacity-50 transform ${
            close ? "scale-0" : "scale-200"
          }   transition-transform duration-300`}
        >
          <div className={`w-4/5 h-1/2 md:w-1/2 md:h-3/4 bg-white relative`}>
            <button
              onClick={hide}
              className="absolute right-[10px] top-[5px] text-xl z-10"
            >
              &#10005;
            </button>
            <div className="absolute w-full h-full top-0 left-0 bottom-0">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
