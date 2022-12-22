import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import styles from "../style/style";
import { socket } from "../service/socket";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

const LandingPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(selectUser);
  const [room, setRoom] = useState("");
  const { isShowing: showSinglePlayOptions, toggle: toggleSinglePlayOptions } =
    useModal();
  const { isShowing: showMultiPlayOptions, toggle: toggleMultiPlayOptions } =
    useModal();
  const { isShowing: showCreateOptions, toggle: toggleCreateOptions } =
    useModal();
  const { isShowing: showJoinGameModal, toggle: toggleJoinGameModal } =
    useModal();

  const handleSinglePlay = () => {
    toggleSinglePlayOptions();
  };
  const handleMultiPlay = () => {
    toggleMultiPlayOptions();
    // navigate("/play/multi");
  };
  const handleGameMode = (mode: string) => {
    navigate(`/play/single/${mode}`);
  };
  const createGame = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      navigate(`/play/multi/${room}`);
    }
  };
  return (
    <div className="bg-gray-800 font-sans leading-normal tracking-normal h-screen">
      {userInfo ? (
        <div className="bg-blue-500 hover:bg-blue-600 absolute top-[20px] right-[20px] text-white font-bold py-1 px-2 rounded-md flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-4"
            src="https://images.unsplash.com/photo-1671625120178-5b129215207e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60"
            alt="User avatar"
          />
          <div className="text-lg font-bold text-gray-900">{userInfo.name}</div>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 absolute top-[20px] right-[20px] text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <FaSignInAlt className="mr-2" />
          Login
        </Link>
      )}
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="w-full lg:w-1/2 px-4 flex flex-col gap-4 items-center ">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Welcome to the Multiplayer Game
          </h1>
          <p className="text-xl font-semibold mb-4 text-white">
            Join the fun and compete with players from around the world!
          </p>
          <div className=" gap-4 flex ">
            <button
              onClick={handleSinglePlay}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Single Player
            </button>
            <button
              onClick={handleMultiPlay}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Multi Player
            </button>
          </div>
        </div>
      </div>
      {/* modal singlePlay */}
      <Modal
        isShowing={showSinglePlayOptions}
        closeButton
        hide={toggleSinglePlayOptions}
      >
        <div className="bg-white w-[300px] h-[300px] flex flex-col justify-evenly text-center p-2">
          <h4 className="text-blue-300 font-bold ">Play Single</h4>
          <div className="grid grid-cols-2 gap-2 h-3/4">
            <div
              onClick={() => handleGameMode("easy")}
              className="border-[rgba(0,0,0,0.2)] cursor-pointer border-solid border-[1px] rounded-md shadow-md"
            >
              Easy
            </div>
            <div
              onClick={() => handleGameMode("hard")}
              className="border-[rgba(0,0,0,0.2)] cursor-pointer border-solid border-[1px] rounded-md shadow-md"
            >
              Hard
            </div>
            <div
              onClick={() => handleGameMode("superHard")}
              className="border-[rgba(0,0,0,0.2)] cursor-pointer border-solid border-[1px] rounded-md shadow-md"
            >
              Super Hard
            </div>
            <div
              onClick={() => handleGameMode("superEyes")}
              className="border-[rgba(0,0,0,0.2)] cursor-pointer border-solid border-[1px] rounded-md shadow-md"
            >
              Super Eyes
            </div>
          </div>
        </div>
      </Modal>
      {/* modal Multiplay */}
      <Modal
        isShowing={showMultiPlayOptions}
        hide={toggleMultiPlayOptions}
        closeButton
      >
        <div className="bg-white w-[400px] h-[400px] flex flex-col justify-evenly items-center">
          <button
            onClick={() => {
              toggleCreateOptions();
              toggleMultiPlayOptions();
            }}
            className="text-blue-300 font-bold w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md  rounded-md"
          >
            Create Game
          </button>
          <button className="text-blue-300 font-bold w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md rounded-md ">
            Play With a Friend
          </button>
          <button className="text-blue-300 font-bold w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md rounded-md">
            Join Room
          </button>
        </div>
      </Modal>
      {/* Modal Create Options */}
      <Modal isShowing={showCreateOptions} hide={toggleCreateOptions}>
        <div className="bg-white w-[300px] md:w-[400px] h-[400px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">Create Room</h4>
          <div className="h-2/3 flex flex-col gap-4">
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

            <div className="grid grid-cols-2 gap-2 h-3/4 px-2">
              <div className="border-[rgba(0,0,0,0.2)] border-solid border-[1px] rounded-md shadow-md">
                Easy
              </div>
              <div className="border-[rgba(0,0,0,0.2)] border-solid border-[1px] rounded-md shadow-md">
                Hard
              </div>
              <div className="border-[rgba(0,0,0,0.2)] border-solid border-[1px] rounded-md shadow-md">
                Super Hard
              </div>
              <div className="border-[rgba(0,0,0,0.2)] border-solid border-[1px] rounded-md shadow-md">
                Super Eyes
              </div>
            </div>
          </div>

          <div className="flex justify-evenly">
            <button
              onClick={createGame}
              className={`${styles.button} px-2 py-1 w-1/3 mx-auto text-black`}
            >
              Create Game
            </button>
            <button
              className={`${styles.button} px-2 py-1 w-1/3 mx-auto text-black`}
              onClick={toggleCreateOptions}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      {/* Modal Join Game */}
      <Modal isShowing={showJoinGameModal} hide={toggleJoinGameModal}>
        <div className="bg-white w-[400px] h-[400px] flex flex-col justify-evenly text-center">
          <h4 className="text-blue-300 font-bold ">Create Room</h4>
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
          <div className="flex justify-evenly">
            <button
              onClick={createGame}
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
            >
              Create Game
            </button>
            <button
              className={`${styles.button} px-2 py-1 w-1/4 mx-auto text-black`}
              onClick={toggleCreateOptions}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
