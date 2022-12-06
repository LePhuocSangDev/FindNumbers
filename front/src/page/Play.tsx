import React, { useState } from "react";
import Chat from "../components/Chat";
import Setting from "../components/Setting";
import "./Play.css";
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
const Play = () => {
  const [chosen, setChosen] = useState(false);
  const [reOrderArray, setReOrderArray] = useState<number[]>(mode1);
  const sufferArray = () => {
    let shuffled = mode1
      .map((value) => ({ value, sort: Math.random() })) // put each element in the array in an object, and give it a random sort key
      .sort((a, b) => a.sort - b.sort) //sort using the random key
      .map(({ value }) => value); //unmap to get the original objects
    setReOrderArray(shuffled);
  };
  const handleChooseNumber = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.classList.add("chosen");
  };
  return (
    <div className="flex h-full gap-6 flex-col md:flex-row">
      <div className="bg-white w-full md:w-3/4 h-screen md:h-auto relative">
        {reOrderArray.map((num, index) => (
          <button
            id={`number-${index + 1}`}
            className={`text-sm md:text-2xl absolute rounded-[50%] p-1 w-7 h-7 md:w-12 md:h-12
            }`}
            key={num}
            onClick={handleChooseNumber}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="p:2 justify-between flex flex-col w-full md:w-1/4 min-w-[200px] h-full">
        <Setting />
        <button onClick={sufferArray}>shuffled</button>
        <Chat />
      </div>
    </div>
  );
};

export default Play;
