import React, { useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { IoMdArrowBack } from "react-icons/io";
import { FcAlarmClock } from "react-icons/fc";
import { BiSearchAlt } from "react-icons/bi";
import { socket } from "../service/socket";
import { useParams } from "react-router-dom";

interface OptionsPros {
  points: number;
  sufferArray(): void;
  handleHint(): void;
  currentNumber: number;
  toggleConfirmBack(): void;
  toggleSetting(): void;
  toggleConfirmReplay(): void;
  toggleResult(): void;
  type: string;
  minute: number;
  second: number;
  hour: number;
  togglePause(): void;
}

const Options = ({
  points,
  handleHint,
  currentNumber,
  toggleConfirmBack,
  toggleConfirmReplay,
  toggleSetting,
  toggleResult,
  minute,
  second,
  hour,
  togglePause,
  type,
}: OptionsPros) => {
  const { room } = useParams();
  return (
    <div className="flex flex-col relative justify-center w-full flex-1 gap-12">
      <div className="flex items-center gap-8">
        <span>Target Number:</span>
        <span className="block text-center p-2 md:px-4 md:py-2 bg-[#413e3c] w-[80px] md:w-[120px] text-yellow-500">
          {currentNumber + 1}
        </span>
      </div>
      <div className="flex gap-2 items-center justify-center absolute right-[20px] top-[8px] md:static">
        <FcAlarmClock className="text-3xl" />
        <span>{`${minute < 10 ? "0" + minute : minute}: ${
          second < 10 ? "0" + second : second
        }`}</span>
      </div>
      <div className="flex justify-evenly text-2xl">
        <button onClick={toggleSetting} title="Setting">
          <AiFillSetting />
        </button>
        <button onClick={toggleConfirmReplay} title="Play Again">
          <TfiReload />
        </button>
        <button onClick={toggleConfirmBack} title="Go Back">
          <IoMdArrowBack />
        </button>
        <button title="Go Back" onClick={handleHint}>
          <BiSearchAlt />
        </button>
      </div>
      <button
        onClick={() => {
          toggleResult();
          togglePause();
          socket.emit("leave_room", room);
        }}
        className="bg-[#413e3c] text-yellow-500 p-2 w-2/3 self-center"
      >
        End Game
      </button>
    </div>
  );
};

export default Options;
