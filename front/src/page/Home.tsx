import React from "react";
import { Link } from "react-router-dom";
import { BsPencil } from "react-icons/bs";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      <div className="w-full h-auto flex-1 md:min-w-[480px] md:min-h-[480px]">
        <img
          className="w-full h-full object-cover rounded-xl"
          src="https://images.unsplash.com/photo-1608178398319-48f814d0750c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=879&q=80"
          alt=""
        />
        <Link to="/play"></Link>
      </div>
      <div className="flex-1 flex flex-col gap-8 md:gap-16 text-center md:px-12 md:py-8">
        <h4 className="text-white text-4xl md:text-6xl font-[500]">
          Enhancing you memory!
        </h4>
        <div className="flex gap-4 flex-col">
          <Link
            className="flex p-2 md:py-4 md:px-6 items-center gap-12 text-white rounded-xl bg-[#413e3c] justify-start"
            to="/play"
          >
            <BsPencil className="text-2xl ml-2" />
            <div>
              <span className="text-[24px] block mb-1">Single Player</span>
              <span className="block text-sm">Enjoy playing by yourself</span>
            </div>
          </Link>
          <Link
            className="flex p-2 md:py-4 md:px-6 items-center gap-12 text-white rounded-xl bg-[#4f46e5] justify-start"
            to="/paly"
          >
            <BsPencil className="text-2xl ml-2" />
            <div>
              <span className="text-[24px] block mb-1">Multi Player</span>
              <span className="block text-sm">Play it with your friend</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
