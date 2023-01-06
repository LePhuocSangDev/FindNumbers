import React, {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  ChangeEvent,
  useState,
} from "react";
import { socket } from "../../service/socket";
import Chat from "../../components/Chat";
import Modal from "../../components/Modal";
import Options from "../../components/Options";
import useModal from "../../hooks/useModal";
import "./Play.css";
import audio from "../../assets/audio/music.mp3";
import style from "../../style/style";
import { useNavigate, useParams } from "react-router-dom";
import { lines, mode1, mode2 } from "../../data/data";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { useAlert, positions } from "react-alert";
import PageAnimation from "../../style/PageAnimation";

interface GameData {
  chosenNumber: number;
  points: number;
  room: string;
  player: string;
}

const Play = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const alert = useAlert();

  const { mode, room } = useParams();
  const { userInfo } = useSelector(selectUser);
  const buttonRef: LegacyRef<HTMLButtonElement> | undefined = useRef() as any;
  const { isShowing: showConfirmBack, toggle: toggleConfirmBack } = useModal();
  const { isShowing: showSetting, toggle: toggleSetting } = useModal();
  const { isShowing: showConfirmReplay, toggle: toggleConfirmReplay } =
    useModal();
  const {
    isShowing: showResult,
    setIsShowing: setShowResult,
    toggle: toggleResult,
  } = useModal();
  const {
    isShowing: showInvitation,
    setIsShowing: setShowInvitation,
    toggle: toggleInvitation,
  } = useModal();
  const {
    isShowing: showNotification,
    setIsShowing: setShowNotification,
    toggle: toggleNotification,
  } = useModal();

  const [currentNumber, setCurrentNumber] = useState(0);
  const numberBtns = document.getElementsByClassName("num-btns");
  const [points, setPoints] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [reloadButton, setReloadButton] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [music] = useState(new Audio(audio));
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameData, setGameData] = useState<GameData>();
  const [invitation, setInvitation] = useState("");
  const [notification, setNotification] = useState("");
  const [playerNum, setPlayerNum] = useState<number[]>([]);
  const [reOrderArray, setReOrderArray] = useState<number[]>(mode1);
  const buttonsCollections = document.getElementsByTagName("button");
  var buttons = Array.from(buttonsCollections);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        // Prevent the default action of the F3 key
        event.preventDefault();
      }
      // Prevent Ctrl + F
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    let interval: NodeJS.Timeout;
    sufferArray();
    if (mode === "easy") {
      sufferArray();
    }
    if (mode === "superhard") {
      interval = setInterval(() => sufferArray(), 15000);
    }
    if (mode === "supereyes") {
      interval = setInterval(() => sufferArray(), 5000);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    isPlaying ? music.play() : music.pause();
    return () => {
      music.pause();
    };
  }, [isPlaying]);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    if (!isPaused) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        if (seconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          setSeconds(0);
        }
        if (minutes === 59) {
          setHours((prevHours) => prevHours + 1);
          setMinutes(0);
          setSeconds(0);
        }
        if (hours === 59) {
          setHours(0);
          setMinutes(0);
          setSeconds(0);
        }
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isPaused, seconds, minutes, hours]);

  useEffect(() => {
    socket.on("receive_gameData", (data) => {
      setGameData(data);
      setPlayerNum((prev) => [...prev, data.chosenNumber]);
      setCurrentNumber((prevCurrent) => prevCurrent + 1);
    });
    socket.on("user_left", (data) => {
      alert.show(data.message);
      toggleResult();
      togglePause();
      setReloadButton(false);
    });

    socket.on("answer_invitation", (data) => {
      setInvitation(data);
      setShowInvitation(true);
    });

    socket.on("replay_game", () => {
      resetGame();
      setShowInvitation(false);
      setShowNotification(true);
      setNotification(`Accepted, click "OK" and play`);
    });
    socket.on("not_replay", (data) => {
      setNotification(data.message);
      setShowNotification(true);
    });

    return () => {
      socket.off("receive_gameData");
      socket.off("user_left");
    };
  }, [socket]);
  useEffect(() => {
    if (currentNumber >= 100) {
      toggleResult();
      togglePause();
    }
  }, [currentNumber]);

  const sufferArray = () => {
    let shuffled = mode1
      .map((value) => ({ value, sort: Math.random() })) // put each element in the array in an object, and give it a random sort key
      .sort((a, b) => a.sort - b.sort) //sort using the random key
      .map(({ value }) => value); //unmap to get the original objects
    setReOrderArray(shuffled);
  };

  const handleChooseNumber = async (
    e: React.MouseEvent<HTMLElement>,
    number: number
  ) => {
    if (number === currentNumber + 1) {
      e.currentTarget.classList.add("chosen-1");
      setCurrentNumber((prevCurrent) => prevCurrent + 1);
      setPoints((prevPoints) => prevPoints + 1);
      const gameData = {
        chosenNumber: number,
        points: points + 1,
        room: room,
        player: userInfo?.name || userInfo?.username,
      };
      await socket.emit("send_gameData", gameData);
    }
  };

  const handleHint = (): void => {
    const targetNumber = currentNumber + 1;
    const targetButton = buttons.find(
      (button) => Number(button.innerText) === targetNumber
    );
    targetButton?.classList.add("help");
    setTimeout(() => {
      targetButton?.classList.remove("help");
    }, 3000);
  };

  const handleReplay = (): void => {
    if (type === "single") {
      toggleResult();
      resetGame();
    } else {
      socket.emit("send_replay_invitation", {
        room: room,
        player: userInfo?.username || userInfo?.name,
        message: "Your opponent want to replay!",
      });
      toggleResult();
      toggleNotification();
      setNotification("");
    }
  };
  const acceptReplay = (): void => {
    socket.emit("accept_replay", room);
    toggleInvitation();
    resetGame();
  };

  const declinedReplay = (): void => {
    socket.emit("decline_replay", room);
    toggleInvitation();
  };
  const handleSound = (e: ChangeEvent<HTMLInputElement>): void => {
    const checked = e.target.checked;
    checked ? setIsPlaying(true) : setIsPlaying(false);
  };
  const resetGame = (): void => {
    setPoints(0);
    setCurrentNumber(0);
    setSeconds(0);
    setMinutes(0);
    togglePause();
    for (const numbtn of numberBtns) {
      numbtn.classList.remove("chosen-1", "chosen-2");
    }
  };

  const goBack = (): void => {
    navigate("/");
    if (type === "multi") {
      socket.emit("leave_room", {
        roomName: room,
        player: userInfo?.username || userInfo?.name,
      });
    }
  };

  const togglePause = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  return (
    <PageAnimation>
      <div className="flex gap-6 flex-col md:flex-row h-auto md:h-screen py-2 px-4 md:px-8 md:py-4">
        <div className="bg-white w-full md:w-5/6 relative h-[90vh] md:h-full rounded-xl">
          {reOrderArray.map((num, index) => (
            <button
              id={`number-${index + 1}`}
              ref={buttonRef}
              className={`button ${mode === "easy" ? "mode-easy" : ""} ${
                playerNum.some((chosenNumber) => chosenNumber === num) &&
                "chosen-2"
              } num-btns z-[10] circle text-md md:text-2xl flex justify-center items-center absolute rounded-[50%] p-1 w-7 h-7 md:w-12 md:h-12 focus-visible:outline-none`}
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
            sufferArray={sufferArray}
            handleHint={handleHint}
            currentNumber={currentNumber}
            toggleConfirmBack={toggleConfirmBack}
            toggleSetting={toggleSetting}
            toggleConfirmReplay={toggleConfirmReplay}
            toggleResult={toggleResult}
            type={type}
            minute={minutes}
            second={seconds}
            togglePause={togglePause}
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
                <input
                  id="sound"
                  type="checkbox"
                  checked={isPlaying}
                  onChange={handleSound}
                />{" "}
                Sound
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
                onClick={goBack}
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
                  handleReplay();
                  toggleConfirmReplay();
                  setShowResult(false);
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
        <Modal isShowing={showResult} closeButton hide={toggleResult}>
          <div className="bg-white w-[250px] h-[280px] flex flex-col justify-evenly text-center">
            <h4 className="text-blue-300 font-bold ">YOUR SCORE</h4>
            <div className="px-2">
              You get <span className="text-yellow-500">{points}</span> points
            </div>
            {gameData && (
              <div className="px-2">
                Your opponent get{" "}
                <span className="text-yellow-500">{gameData.points}</span>{" "}
                points
              </div>
            )}
            <div>
              The time is:{" "}
              <span>{minutes === 0 ? "" : minutes + " minutes and "}</span>
              <span>{seconds} seconds</span>
            </div>
            {type === "multi" && (
              <div>
                {gameData && gameData.points > points ? (
                  <div className="text-red-500 font-bold uppercase text-lg">
                    You lose{" "}
                  </div>
                ) : (
                  <div className="text-green-500 font-bold uppercase text-lg">
                    You Win
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-evenly">
              {reloadButton && (
                <button
                  onClick={handleReplay}
                  className={`${style.button} px-2 py-1 w-[40%] mx-auto text-black`}
                >
                  Play Again
                </button>
              )}
              <button
                onClick={goBack}
                className={`${style.button} px-2 py-1 w-[40%] mx-auto text-black`}
              >
                Go Back
              </button>
            </div>
          </div>
        </Modal>
        <Modal isShowing={showInvitation} hide={toggleInvitation}>
          <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
            <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
            <p>{invitation}</p>
            <div className="flex justify-evenly">
              <button
                onClick={acceptReplay}
                className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
              >
                Yes
              </button>
              <button
                onClick={declinedReplay}
                className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
        <Modal isShowing={showNotification} hide={toggleNotification}>
          <div className="bg-white w-[200px] h-[150px] flex flex-col justify-evenly text-center">
            <h4 className="text-blue-300 font-bold ">MESSAGE</h4>
            {notification === "" ? (
              <p className="px-2">
                Invitation{" "}
                <span className="font-bold text-green-600">sent</span>. Wait for
                your opponent to accept.
              </p>
            ) : (
              <p className="px-4 text-green-600 font-bold">{notification}</p>
            )}
            <button
              className={`${style.button} px-2 py-1 w-1/4 mx-auto text-black`}
              onClick={toggleNotification}
            >
              Ok
            </button>
          </div>
        </Modal>
      </div>
    </PageAnimation>
  );
};

export default Play;
