import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import styles from "../style/style";
import { socket } from "../service/socket";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser } from "../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import bg from "../assets/image/bg-3.png";
import PageAnimation from "../style/PageAnimation";
import easyImg from "../assets/image/easy.png";
import hardImg from "../assets/image/hard.png";
import superHardImg from "../assets/image/superhard.png";
import superEyesImg from "../assets/image/supereyes.png";

const elementVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 2,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 2,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
};
const modeInfos = [
  { mode: "easy", img: easyImg },
  { mode: "hard", img: hardImg },
  { mode: "super hard", img: superHardImg },
  { mode: "super eyes", img: superEyesImg },
];
interface Room {
  _id: string;
  name: string;
  mode: string;
  players: string[];
  time: Date;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(selectUser);
  const { isShowing: showSinglePlayOptions, toggle: toggleSinglePlayOptions } =
    useModal();
  const { isShowing: showMultiPlayOptions, toggle: toggleMultiPlayOptions } =
    useModal();
  const { isShowing: showCreateOptions, toggle: toggleCreateOptions } =
    useModal();
  const { isShowing: showJoinGameModal, toggle: toggleJoinGameModal } =
    useModal();

  const [createGameInfo, setCreateGameInfo] = useState({ name: "", mode: "" });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showUserOptions, setShowUserOptions] = useState(false);
  useEffect(() => {
    socket.emit("get_rooms");
    // Listen for updates to the list of rooms
    socket.on("update_rooms", (newRooms) => {
      setRooms(newRooms);
    });
  }, []);
  const handleSinglePlay = () => {
    toggleSinglePlayOptions();
  };
  const handleMultiPlay = () => {
    socket.emit("get_rooms");
    !userInfo.name && !userInfo.username
      ? navigate("/login")
      : toggleMultiPlayOptions();
  };
  const handleGameMode = (mode: string) => {
    navigate(`/play/single/${mode}`);
  };
  const createGame = () => {
    if (createGameInfo.name !== "" && createGameInfo.mode !== "") {
      socket.emit("create_room", createGameInfo);
      navigate(`/play/multi/${createGameInfo.name}/${createGameInfo.mode}`);
    } else console.log("error");
  };
  const joinRoom = (gameRoom: string, mode: string) => {
    socket.emit("join_room", gameRoom);
    navigate(`/play/multi/${gameRoom}/${mode}`);
  };
  const handleMode = (modeParams: string) => {
    setCreateGameInfo((prev) => ({
      ...prev,
      mode: modeParams.toLowerCase().split(" ").join(""),
    }));
  };

  return (
    <PageAnimation>
      <div
        className={`bg-[bg-cover relative bg-center bg-no-repeat font-sans leading-normal tracking-normal h-screen`}
      >
        <img
          onClick={() => setShowUserOptions(false)}
          src={`${bg}`}
          alt=""
          className="w-full absolute h-full"
        />
        {userInfo && (
          <div
            onClick={() => setShowUserOptions((prev) => !prev)}
            className=" z-10 cursor-pointer hover:bg-blue-600 absolute top-[20px] right-[20px] text-white font-bold py-1 px-2 rounded-md flex items-center"
          >
            {typeof userInfo.picture === "string" && (
              <img
                className="w-8 h-8 rounded-full mr-4"
                src={userInfo.picture}
                alt=""
              />
            )}
            <div className="text-lg font-bold text-white">
              {userInfo.name || userInfo.username}
            </div>
            {showUserOptions && (
              <div className="origin-top-right absolute right-0 top-10 mt-2 w-32 rounded-md shadow-lg">
                <div className="bg-white rounded-md shadow-xs">
                  <div className="py-1">
                    <Link
                      to="/player/friends"
                      className="block text-center px-4 py-2 text-sm font-medium leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    >
                      Friends
                    </Link>
                    <button
                      onClick={() => dispatch(logOut())}
                      className="w-full px-4 z-10 py-2 text-sm font-medium leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="lg:container mx-auto px-4 h-full flex items-center justify-center">
          <div className="w-4/5 md:w-[33%] text-center top-1/2 right-1/2 translate-x-[50%] translate-y-[-50%] md:translate-x-0 md:translate-y-0 md:top-[6%] md:right-[9%] px-4 flex flex-col gap-4 h-[55%] justify-center absolute">
            <motion.h1
              variants={elementVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="text-4xl font-bold mb-4 text-white"
            >
              Welcome to Find Numbers Game
            </motion.h1>
            <motion.p
              variants={elementVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="text-xl font-semibold mb-4 text-white"
            >
              Join the fun and compete with players from around the world!
            </motion.p>
            <div className=" gap-2 flex w-full justify-center text-sm ">
              <motion.button
                variants={elementVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                onClick={handleSinglePlay}
                className="md:w-1/2 bg-[#fca97d] hover:bg-[#f15f57] text-white font-bold py-2 px-4 rounded-full"
              >
                Single Player
              </motion.button>
              <motion.button
                variants={elementVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                onClick={handleMultiPlay}
                className="md:w-1/2 bg-[#7efceb] hover:bg-[#248070] text-white font-bold py-2 px-4 rounded-full"
              >
                Multi Player
              </motion.button>
            </div>
          </div>
        </div>
        {/* modal singlePlay */}
        <Modal
          isShowing={showSinglePlayOptions}
          closeButton
          hide={toggleSinglePlayOptions}
        >
          <div className="bg-white w-[300px] rounded-lg h-[300px] md:w-[500px] md:h-[500px] flex flex-col justify-evenly text-center p-2">
            <h4 className="text-blue-300 font-bold ">Choose Difficulty</h4>
            <div className="grid grid-cols-2 gap-2 h-3/4">
              <div
                onClick={() => handleGameMode("easy")}
                className="border-[rgba(0,0,0,0.2)] relative cursor-pointer border-solid border-[1px] rounded-md shadow-md"
              >
                <img
                  src={easyImg}
                  className="absolute w-full h-full rounded-md"
                  alt=""
                />
              </div>
              <div
                onClick={() => handleGameMode("hard")}
                className="border-[rgba(0,0,0,0.2)] relative cursor-pointer border-solid border-[1px] rounded-md shadow-md"
              >
                <img
                  src={hardImg}
                  className="absolute w-full h-full rounded-md"
                  alt=""
                />
              </div>
              <div
                onClick={() => handleGameMode("superhard")}
                className="border-[rgba(0,0,0,0.2)] relative cursor-pointer border-solid border-[1px] rounded-md shadow-md"
              >
                <img
                  src={superHardImg}
                  className="absolute w-full h-full rounded-md"
                  alt=""
                />
              </div>
              <div
                onClick={() => handleGameMode("supereyes")}
                className="border-[rgba(0,0,0,0.2)] relative cursor-pointer border-solid border-[1px] rounded-md shadow-md"
              >
                <img
                  src={superEyesImg}
                  className="absolute w-full h-full rounded-md"
                  alt=""
                />
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
          <div className="bg-white w-[300px] h-[400px] md:w-[400px] rounded-md flex flex-col justify-evenly items-center">
            <button
              onClick={() => {
                toggleCreateOptions();
                toggleMultiPlayOptions();
              }}
              className="text-blue-300 font-bold w-3/5 md:w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md  rounded-md"
            >
              Create Game
            </button>
            <button className="text-blue-300 font-bold w-3/5 md:w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md rounded-md ">
              Play With a Friend
            </button>
            <button
              onClick={() => {
                toggleJoinGameModal();
                toggleMultiPlayOptions();
              }}
              className="text-blue-300 font-bold w-3/5 md:w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md rounded-md"
            >
              Join Room
            </button>
          </div>
        </Modal>
        {/* Modal Create Options */}
        <Modal isShowing={showCreateOptions} hide={toggleCreateOptions}>
          <div className="bg-white w-[300px] h-[400px] md:w-[500px] md:h-[500px] flex flex-col justify-evenly text-center">
            <h4 className="text-blue-300 font-bold text-lg">Create Room</h4>
            <div className="h-3/4 flex flex-col gap-4 md:gap-8">
              <label htmlFor="create-game">
                Enter Room Name
                <input
                  id="create-game"
                  value={createGameInfo.name}
                  onChange={(e) =>
                    setCreateGameInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="bg-[#413e3c] text-yellow-500 p-2 ml-2"
                  type="text"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 h-3/4 px-2">
                {modeInfos.map((modeInfo) => (
                  <div
                    onClick={() => handleMode(modeInfo.mode)}
                    key={modeInfo.mode}
                    className="border-[rgba(0,0,0,0.2)] relative cursor-pointer border-solid border-[1px] rounded-md shadow-md"
                  >
                    <img
                      src={modeInfo.img}
                      alt="/"
                      className="absolute w-full h-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-evenly">
              <button
                onClick={createGame}
                className={`${styles.button} px-2 py-1 md:w-1/3 mx-auto text-black`}
              >
                Create Game
              </button>
              <button
                className={`${styles.button} px-2 py-1 md:w-1/3 mx-auto text-black`}
                onClick={toggleCreateOptions}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        {/* Modal Join Game */}
        <Modal
          isShowing={showJoinGameModal}
          closeButton
          hide={toggleJoinGameModal}
        >
          <div className="bg-white py-4 px-2 w-[300px] md:w-[500px] lg:w-[700px] h-[400px] md:h-[500px] lg:h-[500px] flex flex-col gap-4 text-center">
            <h4 className="text-blue-300 font-bold text-2xl ">Join Room</h4>
            <label
              htmlFor="create-game"
              className="flex flex-col md:flex-row gap-2 justify-center items-center"
            >
              Enter Room Code
              <div className="relative w-[90%] md:w-1/3 self-center">
                <input
                  id="create-game"
                  // value={room}
                  // onChange={(e) => setRoom(e.target.value)}
                  className="bg-[#413e3c] text-yellow-500 p-2 w-full"
                  type="text"
                />
                <button
                  className={`${styles.button} absolute right-[4px] top-1/2 translate-y-[-50%] px-2 py-1`}
                >
                  Join
                </button>
              </div>
            </label>
            or Enter Room:
            <div className="h-full grid grid-cols-2 gap-2 overflow-y-auto scrolling-touch">
              {Array.isArray(rooms) &&
                rooms.map((room) => (
                  <div
                    onClick={() => joinRoom(room.name, room.mode)}
                    key={room.name}
                    className="border-solid cursor-pointer border-black border-[1px] h-[150px]"
                  >
                    {room.name}
                    {room.mode}
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      </div>
    </PageAnimation>
  );
};

export default LandingPage;
