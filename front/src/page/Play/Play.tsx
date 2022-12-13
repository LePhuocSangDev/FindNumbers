import React, { useEffect, useState } from "react";
import { socket } from "../../service/socket";
import Chat from "../../components/Chat";
import Modal from "../../components/Modal";
import Options from "../../components/Options";
import useModal from "../../hooks/useModal";
import "./Play.css";
import audio from "../../assets/audio/music.mp3";
import style from "../../style/style";
import { useNavigate } from "react-router-dom";
import { lines, mode1, mode2 } from "../../data/data";

const Play = ({ type }: { type: string }) => {
  const navigate = useNavigate();

  const { isShowing: showConfirmBack, toggle: toggleConfirmBack } = useModal();
  const { isShowing: showSetting, toggle: toggleSetting } = useModal();
  const { isShowing: showConfirmReplay, toggle: toggleConfirmReplay } =
    useModal();
  const { isShowing: showResult, toggle: toggleResult } = useModal();

  const [currentNumber, setCurrentNumber] = useState(0);
  const [points, setPoints] = useState(0);
  const [music] = useState(new Audio(audio));
  const [reOrderArray, setReOrderArray] = useState<number[]>(mode1);
  const buttonsCollections = document.getElementsByTagName("button");
  var buttons = Array.from(buttonsCollections);

  useEffect(() => {
    sufferArray();
  }, []);

  const sufferArray = () => {
    let shuffled = mode1
      .map((value) => ({ value, sort: Math.random() })) // put each element in the array in an object, and give it a random sort key
      .sort((a, b) => a.sort - b.sort) //sort using the random key
      .map(({ value }) => value); //unmap to get the original objects
    setReOrderArray(shuffled);
  };
  const handleChooseNumber = (
    e: React.MouseEvent<HTMLElement>,
    number: number
  ) => {
    if (number === currentNumber + 1) {
      e.currentTarget.classList.add("spin");
      e.currentTarget.classList.add("chosen");
      setCurrentNumber((prevCurrent) => prevCurrent + 1);
      setPoints((prevPoints) => prevPoints + 1);
    }
  };
  const handleHint = (): void => {
    const targetNumber = currentNumber + 1;
    const targetButton = buttons.find(
      (button) => Number(button.innerText) === targetNumber
    );
    targetButton?.classList.add("chosen", "help");
    currentNumber < 100 && setCurrentNumber(currentNumber + 1);
  };
  const handleSound = (e: any): void => {
    const checked = e.target.checked;
    checked ? music.play() : music.pause();
  };
  return (
    <div className="flex gap-6 flex-col md:flex-row md:h-screen py-2 px-4 md:px-8 md:py-4">
      <div className="bg-white w-full md:w-5/6 relative h-[70vh] md:h-full rounded-xl">
        {reOrderArray.map((num, index) => (
          <button
            id={`number-${index + 1}`}
            className={`button z-[10] circle text-md md:text-2xl flex justify-center items-center absolute rounded-[50%] p-1 w-7 h-7 md:w-12 md:h-12 focus-visible:outline-none`}
            key={num}
            onClick={(e) => handleChooseNumber(e, num)}
          >
            {num}
          </button>
        ))}
        {lines.map((line) => (
          <div
            key={line}
            id={`line-${line}`}
            className={`w-full h-[2px] bg-blue-200 absolute`}
          ></div>
        ))}
      </div>
      <div
        className={`p:2 justify-between flex items-center w-full md:w-1/6 min-w-[200px] h-full ${
          type === "multi" && "flex-col"
        }`}
      >
        <Options
          points={points}
          sufferArray={sufferArray}
          handleHint={handleHint}
          currentNumber={currentNumber}
          toggleConfirmBack={toggleConfirmBack}
          toggleSetting={toggleSetting}
          toggleConfirmReplay={toggleConfirmReplay}
          toggleResult={toggleResult}
          type={type}
        />
        {type === "single" ? "" : <Chat />}
      </div>
      <Modal isShowing={showSetting} hide={toggleSetting}>
        <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">OPTIONS</h4>
          <div className="flex justify-evenly">
            <label htmlFor="dark-mode">
              <input id="dark-mode" type="checkbox" /> Night
            </label>
            <label htmlFor="sound">
              <input id="sound" type="checkbox" onChange={handleSound} /> Sound
            </label>
          </div>
          <button
            onClick={toggleSetting}
            className={`${style.button} px-2 py-1 w-1/2 mx-auto text-black`}
          >
            Ok
          </button>
        </div>
      </Modal>
      <Modal isShowing={showConfirmBack} hide={toggleConfirmBack}>
        <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
          <p>Do you want to go back?</p>
          <div className="flex justify-evenly">
            <button
              onClick={() => navigate("/")}
              className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Yes
            </button>
            <button
              onClick={toggleConfirmBack}
              className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal isShowing={showConfirmReplay} hide={toggleConfirmReplay}>
        <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
          <p>Do you want to replay?</p>
          <div className="flex justify-evenly">
            <button
              onClick={() => {
                location.reload();
              }}
              className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Yes
            </button>
            <button
              onClick={toggleConfirmReplay}
              className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal isShowing={showResult} hide={toggleResult}>
        <div className="bg-white w-[250px] h-[180px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">YOUR SCORE</h4>
          <div className="px-2">
            You get <span className="text-yellow-500">{points}</span> points in{" "}
            <span>20 minutes</span> and <span>10 seconds</span>
          </div>
          <div className="flex justify-evenly">
            <button
              onClick={() => {
                location.reload();
              }}
              className={`${style.button} px-2 py-1 w-[40%] mx-auto text-black`}
            >
              Play Again
            </button>
            <button
              onClick={() => navigate("/")}
              className={`${style.button} px-2 py-1 w-[40%] mx-auto text-black`}
            >
              Go Back
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Play;
