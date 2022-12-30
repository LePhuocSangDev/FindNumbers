import * as io from "socket.io-client";

export const socket = io.connect("https://findnumbers.up.railway.app");
