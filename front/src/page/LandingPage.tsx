import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import style from "../style/style";
import { socket } from "../service/socket";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser } from "../redux/userSlice";
import { motion } from "framer-motion";
import bg from "../assets/image/bg-3.png";
import PageAnimation from "../style/PageAnimation";
import easyImg from "../assets/image/easy.png";
import hardImg from "../assets/image/hard.png";
import roomImg from "../assets/image/room.png";
import superHardImg from "../assets/image/superhard.png";
import superEyesImg from "../assets/image/supereyes.png";
import { GiAmericanFootballPlayer } from "react-icons/gi";
import { BsFillPersonFill, BsFillCheckCircleFill } from "react-icons/bs";
import { useAlert } from "react-alert";

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
  available: boolean;
  name: string;
  mode: string;
  players: string[];
  time: Date;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { userInfo } = useSelector(selectUser);

  const { isShowing: showSinglePlayOptions, toggle: toggleSinglePlayOptions } =
    useModal();
  const { isShowing: showMultiPlayOptions, toggle: toggleMultiPlayOptions } =
    useModal();
  const { isShowing: showCreateOptions, toggle: toggleCreateOptions } =
    useModal();
  const { isShowing: showJoinGameModal, toggle: toggleJoinGameModal } =
    useModal();
  const { isShowing: showInRoomModal, toggle: toggleInRoomModal } = useModal();

  const [selected, setSelected] = useState<null | string>(null);
  const [createGameInfo, setCreateGameInfo] = useState({ name: "", mode: "" });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomMode, setRoomMode] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [createErr, setCreateErr] = useState(false);
  const [joinedRoomInfo, setJoinedRoomInfo] = useState("");
  const [numberOfReady, setNumberOfReady] = useState(0);
  const [secondPlayerReady, setSecondPlayerReady] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState<string[] | undefined>([]);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [notify, setNotify] = useState("");
  const availableRooms = rooms.filter((r) => r.available === true);

  useEffect(() => {
    socket.emit("get_rooms");
    // Listen for updates to the list of rooms
    socket.on("update_rooms", (newRooms) => {
      if (Array.isArray(newRooms)) {
        setRooms(newRooms);
      } else {
        if (rooms.length > 0) {
          const roomIndex = rooms.findIndex(
            (room) => room.name === newRooms.name
          );
          const updatedRoom = rooms.filter((_, index) => index !== roomIndex);
          updatedRoom.push(newRooms);
          setRooms(updatedRoom);
        }
      }
    });
    socket.on("error", (err) => {
      alert.error(err);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("user_left", (data) => {
      socket.emit("get_rooms");
      setNotify(data.message);
      setIsReady(false); // allow user ready only when both users in room
    });
    socket.on("user_joined", (data) => {
      socket.emit("get_rooms");
      // update rooms list before doing logic bellow, otherwise its will be undefined.
      setNotify(`${data.player} has joined`);
      setJoinedRoomInfo(data.room);
      setIsReady(false);
    });
    socket.on("playerReady", (playerReady) => {
      if (playerReady.name && userInfo) {
        (playerReady.name !== userInfo.username ||
          playerReady.name !== userInfo.name) &&
          setSecondPlayerReady(true);
      }
      setNumberOfReady(playerReady.numberOfReady);
    });
    socket.on("game_start", () => {
      const mode = localStorage.getItem("roomMode");
      const roomName = localStorage.getItem("roomName");
      if (mode && roomName) {
        const m = mode.replace(/"/g, ""); // change "abc" to abc
        const r = roomName.replace(/"/g, "");
        navigate(`/play/multi/${r}/${m}`);
      } else {
        console.log("error");
      }
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, [socket]);
  useEffect(() => {
    window.localStorage.setItem("roomName", JSON.stringify(roomName));
    window.localStorage.setItem("roomMode", JSON.stringify(roomMode));
  }, [roomName, roomMode]);
  console.log(userInfo);
  const handleSinglePlay = () => {
    toggleSinglePlayOptions();
  };

  const handleMultiPlay = () => {
    socket.emit("get_rooms");
    !userInfo ? navigate("/login") : toggleMultiPlayOptions();
  };
  const handleGameMode = (mode: string) => {
    navigate(`/play/single/${mode}`);
  };
  const createGame = () => {
    const isRoomExist = rooms.find((r) => r.name === createGameInfo.name);
    if (isRoomExist) {
      setCreateErr(true);
    }
    if (
      createGameInfo.name !== "" &&
      createGameInfo.mode !== "" &&
      !isNaN(Number(createGameInfo.name)) &&
      !isRoomExist
    ) {
      socket.emit("create_room", createGameInfo);
      socket.emit("join_room", {
        name: createGameInfo.name,
        player: userInfo?.username || userInfo?.name,
      });
      toggleInRoomModal();
      setRoomName(createGameInfo.name);
      setRoomMode(createGameInfo.mode);
      toggleCreateOptions();
    } else if (createGameInfo.name === "") {
      alert.error("Please don't leave Room Number empty");
    } else if (isNaN(Number(createGameInfo.name))) {
      alert.error("Please enter only numbers");
    }
  };
  const joinRoom = (
    gameRoom: { name: string; player: string | undefined },
    mode: string
  ) => {
    if (gameRoom.name !== "") {
      socket.emit("join_room", gameRoom);
      toggleInRoomModal();
      toggleJoinGameModal();
      setRoomName(gameRoom.name);
      setRoomMode(mode);
    }
  };
  const joinRoomByNumber = (gameRoom: string) => {
    if (gameRoom !== "") {
      socket.emit("join_room", gameRoom);
    }
  };
  const handleMode = (modeParams: string) => {
    setCreateGameInfo((prev) => ({
      ...prev,
      mode: modeParams.toLowerCase().split(" ").join(""),
    }));
    setSelected(modeParams);
  };
  const handleReady = () => {
    setIsReady(true);
    socket.emit("ready", {
      name: userInfo?.username || userInfo?.name,
      roomName: roomName,
    });
    numberOfReady >= 1 && navigate(`/play/multi/${roomName}/${roomMode}`);
  };
  useEffect(() => {
    getPlayersInRoom(joinedRoomInfo);
  }, [rooms]);
  const getPlayersInRoom = async (roomName: string) => {
    const foundRoom = rooms.find((r) => r.name === roomName);
    setPlayersInRoom(foundRoom?.players);
  };
  console.log(playersInRoom);
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
          <div className="bg-white w-[300px] h-[250px] md:w-[350px] rounded-md flex flex-col justify-evenly items-center">
            <button
              onClick={() => {
                toggleCreateOptions();
                toggleMultiPlayOptions();
              }}
              className="text-blue-300 font-bold w-3/5 md:w-2/5 text-center block py-2 border-solid border-[rgba(0,0,0,0.2)] border-[1px] shadow-md  rounded-md"
            >
              Create Game
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
                  onChange={(e) => {
                    setCreateGameInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    setCreateErr(false);
                  }}
                  className="bg-[#413e3c] text-yellow-500 p-2 ml-2"
                  type="text"
                />
              </label>
              {createErr && <p className="text-red-500">Room already exists</p>}

              <div className="grid grid-cols-2 gap-2 h-3/4 px-2">
                {modeInfos.map((modeInfo) => (
                  <div
                    onClick={() => handleMode(modeInfo.mode)}
                    key={modeInfo.mode}
                    id={modeInfo.mode}
                    className={`${
                      selected === modeInfo.mode &&
                      "border-[red]  border-solid border-[4px]"
                    }  relative cursor-pointer rounded-md shadow-md`}
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
                className={`${style.button} px-2 py-1 md:w-1/3 mx-auto text-black`}
              >
                Create Game
              </button>
              <button
                className={`${style.button} px-2 py-1 md:w-1/3 mx-auto text-black`}
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
          <div className="bg-white py-4 px-2 w-[300px] md:w-[500px] h-[400px] md:h-[500px] lg:h-[500px] flex flex-col gap-4 text-center">
            <h4 className="text-blue-300 font-bold text-2xl ">Join Room</h4>
            <label
              htmlFor="create-game"
              className="flex flex-col md:flex-row gap-2 justify-center items-center"
            >
              Enter Room Number
              <div className="relative w-[90%] md:w-1/3 self-center">
                <input
                  id="create-game"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-[#413e3c] text-yellow-500 p-2 w-full"
                  type="text"
                />
                <button
                  onClick={() => joinRoomByNumber(roomName)}
                  className={`${style.button} absolute right-[4px] top-1/2 translate-y-[-50%] px-2 py-1`}
                >
                  Join
                </button>
              </div>
            </label>
            or Enter Room:
            <div className="h-full grid grid-cols-2 gap-2 overflow-y-auto scrolling-touch ">
              {Array.isArray(availableRooms) &&
                availableRooms.map((room) => (
                  <div
                    onClick={() =>
                      joinRoom(
                        { name: room.name, player: userInfo?.username },
                        room.mode
                      )
                    }
                    key={room.name}
                    className="border-solid cursor-pointer relative h-[150px] border-[1px] border-[rgba(0,0,0,0.3)] rounded-md"
                  >
                    <img
                      src={roomImg}
                      alt=""
                      className="absolute w-full h-full rounded-md"
                    />
                    <span className="absolute top-[32%] font-bold text-lg md:text-xl left-[50%] translate-x-[-50%]">
                      {room.name}
                    </span>
                    <span className="absolute top-[50%] text-gray-500 text-sm left-[50%] translate-x-[-50%]">
                      {room.mode?.replace("super", "super ")}
                      {/* change "supereyes to "super eyes" */}
                    </span>
                    <span className="absolute top-[65%] text-gray-500 text-sm flex justify-center gap-1 items-center left-[50%] translate-x-[-50%]">
                      <BsFillPersonFill style={{ fontSize: "18px" }} />{" "}
                      {`${room.players.length}/2`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
        {/* Modal in room */}
        <Modal isShowing={showInRoomModal} closeButton hide={toggleInRoomModal}>
          <div className="bg-white w-[350px] md:w-[400px] h-auto flex flex-col gap-4 text-center p-2">
            <h4 className="text-blue-300 font-bold ">
              {`Room : ${roomName}, Mode: ${roomMode}`}{" "}
              {playersInRoom && playersInRoom.length >= 2 ? (
                <p className="text-green-500 text-[12px]">
                  Lets click "ready" and play
                </p>
              ) : playersInRoom && playersInRoom.length == 1 ? (
                <p className="text-green-500 text-[12px]">
                  Wait for orther players to join
                </p>
              ) : (
                <p className="text-green-500 text-[12px]">{notify}</p>
              )}
            </h4>
            <div className="h-1/2 flex">
              <p className="flex-1 flex items-center h-auto break-all border-r-[1px] border-r-black pr-2">
                <BsFillPersonFill style={{ fontSize: "24px" }} />{" "}
                <span className="break-all w-4/5">
                  {playersInRoom && playersInRoom[0]}
                </span>
                {isReady && (
                  <BsFillCheckCircleFill style={{ color: "green" }} />
                )}
              </p>
              <p className="flex-1 flex items-center h-auto break-all">
                <GiAmericanFootballPlayer
                  style={{
                    paddingLeft: "4px",
                    fontSize: "24px",
                    color: "red",
                  }}
                />
                <span className="break-all w-4/5">
                  {playersInRoom && playersInRoom[1]}
                </span>
                {secondPlayerReady && (
                  <BsFillCheckCircleFill style={{ color: "green" }} />
                )}
              </p>
            </div>
            <div className="flex justify-evenly">
              <button
                onClick={handleReady}
                className={`${style.button} px-2 py-1 w-1/3 mx-auto text-black`}
              >
                Ready
              </button>
              <button
                onClick={() => {
                  toggleInRoomModal();
                  socket.emit("leave_room", {
                    roomName: roomName,
                    player: userInfo?.username || userInfo?.name,
                  });
                  setIsReady(false);
                  setSecondPlayerReady(false);
                }}
                className={`${style.button} px-2 py-1 w-1/3 mx-auto text-black`}
              >
                Leave Room
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageAnimation>
  );
};

export default LandingPage;
