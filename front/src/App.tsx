import { useState } from "react";
import { BsPencil } from "react-icons/bs";
import { Link, Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";

function App() {
  return (
    <div className="w-screen h-auto md:h-screen flex ">
      <SideBar />
      <div className="ml-[56px] bg-[#312e2b] md:ml-[192px] w-[calc(100vw-56px)] md:w-[calc(100vw-192px)] p-4 md:py-4 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
