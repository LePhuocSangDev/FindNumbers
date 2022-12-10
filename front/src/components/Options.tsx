import React, { useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { IoMdArrowBack } from "react-icons/io";
import { FcAlarmClock } from "react-icons/fc";
import { BiSearchAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface OptionsPros {
  points: number;
  sufferArray(): void;
  handleHint(): void;
  currentNumber: number;
  toggleConfirmBack(): void;
  toggleSetting(): void;
  toggleConfirmReplay(): void;
  type: string;
}

const Options = ({
  points,
  sufferArray,
  handleHint,
  currentNumber,
  toggleConfirmBack,
  toggleConfirmReplay,
  toggleSetting,
  type,
}: OptionsPros) => {
  const navigate = useNavigate();
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [hour, setHour] = useState(0);
  let timer: any;
  const handleClock = () => {
    useEffect(() => {
      timer = setInterval(() => {
        setSecond(second + 1);
        if (second === 59) {
          setMinute(minute + 1);
          setSecond(0);
        }
        if (minute === 59) {
          setHour(hour + 1);
          setMinute(0);
          setSecond(0);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }, [second]);
  };
  handleClock();

  return (
    <div className="flex flex-col relative justify-center w-full flex-1 gap-12">
      <div className="flex items-center gap-8">
        <span>Target Number:</span>
        <span className="block text-center px-4 py-2 bg-[#413e3c] w-[120px] text-yellow-500">
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
      <button className="bg-[#413e3c] text-yellow-500 px-4 py-2 w-1/2 self-center">
        Result
      </button>
    </div>
  );
};

export default Options;
