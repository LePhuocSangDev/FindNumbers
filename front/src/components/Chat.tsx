import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../service/socket";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
interface Message {
  room: string;
  message: string;
  author: string | undefined;
  time: Date;
  picture: string | undefined;
}
const Chat = () => {
  const { userInfo } = useSelector(selectUser);
  const location = useLocation();
  const room = location.pathname.split("/")[3];
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const sendMessage = async () => {
    try {
      if (currentMessage !== "") {
        const messageData: Message = {
          room: room,
          message: currentMessage,
          author: userInfo?.name || userInfo?.username,
          time: new Date(),
          picture: userInfo?.picture,
        };
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("update_messages", (previousMessages) => {
      setMessageList(previousMessages);
    });
    socket.on("user_left", (id) => {
      if (Notification.permission === "granted") {
        new Notification(`User ${id} has left the room`);
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex-1 w-full">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"></div>
      <div
        id="messages"
        className="flex flex-col h-[42vh] space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <ScrollToBottom>
          {messageList.map((msg: Message, index) => (
            <div key={index} className="chat-message pb-2">
              <div
                className={`flex items-end ${
                  userInfo?.name || userInfo?.username === msg.author
                    ? "justify-end"
                    : "justify-start"
                }  `}
              >
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end w-full h-auto">
                  <p
                    className={`px-4 py-2 rounded-lg w-full h-auto break-all ${
                      userInfo?.name || userInfo?.username === msg.author
                        ? "bg-white text-black rounded-br-none"
                        : "bg-blue-600 rounded-bl-none text-white"
                    } `}
                  >
                    {msg.message}
                  </p>
                </div>
                <img
                  src={
                    userInfo?.name || userInfo?.username === msg.author
                      ? userInfo?.picture
                      : msg.picture
                  }
                  className={`w-6 h-6 rounded-full ${
                    userInfo?.name || userInfo?.username === msg.author
                      ? "order-2"
                      : "order-2/"
                  } order-2/`}
                />
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="border-t-2 border-gray-200 px-2 py-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
            placeholder="Write your message!"
            className="w-full focus:outline-none break-all h-auto focus:placeholder-gray-400 text-gray-600 placeholder-gray-600  bg-gray-200 rounded-md p-2 text-sm "
          />
          <div className="absolute right-[8px] items-center inset-y-0 hidden sm:flex">
            <button onClick={sendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 ml-2 transform rotate-90 text-blue-500"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
