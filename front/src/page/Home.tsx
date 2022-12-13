import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPencil } from "react-icons/bs";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import styles from "../style/style";
import img from "../assets/image/img1.png";
import { socket } from "../service/socket";

const Home = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const { isShowing: showSinglePlayOptions, toggle: toggleSinglePlayOptions } =
    useModal();
  const { isShowing: showMultiPlayOptions, toggle: toggleMultiPlayOptions } =
    useModal();
  const { isShowing: showRoom, toggle: toggleRoom } = useModal();

  const handleSinglePlay = () => {
    toggleSinglePlayOptions();
    // navigate("/play/single");
  };
  const handleMultiPlay = () => {
    toggleMultiPlayOptions();
    // navigate("/play/multi");
  };

  const createGame = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      navigate(`/play/multi/${room}`);
    }
  };

  const joinGame = () => {};
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      <div className="w-full h-auto flex-1 md:min-w-[480px] md:min-h-[480px]">
        <img
          className="w-full h-full object-cover rounded-xl"
          src={img}
          alt=""
        />
        <Link to="/play/single"></Link>
      </div>
      <div className="flex-1 flex flex-col gap-8 md:gap-16 text-center md:px-12 md:py-8">
        <h4 className="text-white text-4xl md:text-6xl font-[500]">
          Enhancing you memory!
        </h4>
        <div className="flex gap-4 flex-col">
          <button
            onClick={handleSinglePlay}
            className="flex p-2 md:py-4 md:px-6 items-center gap-12 text-white rounded-xl bg-[#413e3c] justify-start"
          >
            <BsPencil className="text-2xl ml-2" />
            <div>
              <span className="text-[24px] block mb-1">Single Player</span>
              <span className="block text-sm">Enjoy playing by yourself</span>
            </div>
          </button>
          <button
            onClick={handleMultiPlay}
            className="flex p-2 md:py-4 md:px-6 items-center gap-12 text-white rounded-xl bg-[#4f46e5] justify-start"
          >
            <BsPencil className="text-2xl ml-2" />
            <div>
              <span className="text-[24px] block mb-1">Multi Player</span>
              <span className="block text-sm">Play it with your friend</span>
            </div>
          </button>
        </div>
      </div>
      <Modal isShowing={showSinglePlayOptions} hide={toggleSinglePlayOptions}>
        <div className="bg-white w-[300px] h-[300px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">Play Single</h4>
          <div className="flex flex-col">
            <select name="" id="">
              <option value="">100 numbers</option>
              <option value="">150 numbers</option>
            </select>
            <select>
              <option>Easy</option>
              <option>Difficult</option>
            </select>
          </div>
          <div className="flex justify-evenly">
            <button
              onClick={() => navigate("/play/single")}
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Yes
            </button>
            <button
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal isShowing={showMultiPlayOptions} hide={toggleMultiPlayOptions}>
        <div className="bg-white w-[400px] h-[400px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
          <label htmlFor="create-game">
            Enter Game Code
            <input
              id="create-game"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="bg-[#413e3c] text-yellow-500 p-2 ml-2"
              type="text"
            />
          </label>
          <label htmlFor="create-game">
            Join Game
            <input
              id="create-game"
              className="bg-[#413e3c] text-yellow-500 p-2 ml-2"
              type="text"
            />
          </label>
          <div className="flex justify-evenly">
            <button
              onClick={createGame}
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Create Game
            </button>
            <button
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
              onClick={joinGame}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal isShowing={showRoom} hide={toggleRoom}>
        <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
          <p>Do you want to go back?</p>
          <div className="flex justify-evenly">
            <button
              onClick={() => navigate("/play/multi")}
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Yes
            </button>
            <button
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
