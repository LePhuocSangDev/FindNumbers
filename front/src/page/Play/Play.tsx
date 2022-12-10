import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat";
import Modal from "../../components/Modal";
import Options from "../../components/Options";
import useModal from "../../hooks/useModal";
import "./Play.css";
import audio from "../../assets/audio/music.mp3";
const mode1 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100,
];
const mode2 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
  115, 116, 117, 118,
];
const Play = ({ type }: { type: string }) => {
  const { isShowing: showConfirmBack, toggle: toggleConfirmBack } = useModal();
  const { isShowing: showSetting, toggle: toggleSetting } = useModal();
  const { isShowing: showConfirmReplay, toggle: toggleConfirmReplay } =
    useModal();
  const [currentNumber, setCurrentNumber] = useState(0);
  const [points, setPoints] = useState(0);
  const [music] = useState(new Audio(audio));
  const [reOrderArray, setReOrderArray] = useState<number[]>(mode1);
  const buttonsCollections = document.getElementsByTagName("button");
  var buttons = Array.from(buttonsCollections);
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
      e.currentTarget.classList.add("chosen");
      setCurrentNumber((prevCurrent) => prevCurrent + 1);
      setPoints((prevPoints) => prevPoints + 1);
    }
  };
  useEffect(() => {
    sufferArray();
    music.play();
  }, []);
  const handleHint = (): void => {
    const targetNumber = currentNumber + 1;
    const targetButton = buttons.find(
      (button) => Number(button.innerText) === targetNumber
    );
    targetButton?.classList.add("chosen", "help");
    currentNumber < 100 && setCurrentNumber(currentNumber + 1);
  };
  return (
    <div className="flex gap-6 flex-col md:flex-row md:h-screen py-2 px-4 md:px-8 md:py-4">
      <div className="bg-white w-full md:w-5/6 relative h-[calc(100vh-16px)] md:h-full rounded-xl">
        {reOrderArray.map((num, index) => (
          <button
            id={`number-${index + 1}`}
            className={`text-md md:text-2xl flex justify-center items-center absolute rounded-[50%] p-1 w-7 h-7 md:w-12 md:h-12 focus-visible:outline-none}`}
            key={num}
            onClick={(e) => handleChooseNumber(e, num)}
          >
            {num}
          </button>
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
          type={type}
        />
        {type === "single" ? "" : <Chat />}
      </div>
      <Modal isShowing={showSetting} hide={toggleSetting}>
        <div>hehe</div>
      </Modal>
      <Modal isShowing={showConfirmBack} hide={toggleConfirmBack}>
        <div className="w-[500px] h-[500px]">setting</div>
      </Modal>
      <Modal isShowing={showConfirmReplay} hide={toggleConfirmReplay}>
        <div>replay</div>
      </Modal>
    </div>
  );
};

export default Play;
