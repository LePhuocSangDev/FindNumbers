import React, { useState, useEffect } from "react";
import { AiFillLock } from "react-icons/ai";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import FacebookLogin from "react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle, selectUser, userLogin } from "../redux/userSlice";
import loginBg from "../assets/image/bg-1.png";
import PageAnimation from "../style/PageAnimation";

const schema = yup
  .object({
    username: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .max(25, "Please enter up to 25 characters")
      .required("This field is required"),
    password: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .max(25, "Please enter up to 25 characters")
      .required("This field is required"),
  })
  .required();

const Login = () => {
  const { isShowing, toggle } = useModal();
  const navigate = useNavigate();
  const {
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const dispatch: (action: any) => void = useDispatch();
  const { userInfo, error } = useSelector(selectUser);

  useEffect(() => {
    userInfo !== null && navigate("/");
  }, [userInfo]);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const request = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      dispatch(loginGoogle(request.data));
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const responseFacebook = (response: any) => {
    dispatch(loginGoogle(response)); // assign userInfo with response
  };
  return (
    <PageAnimation>
      <div className="flex min-h-full h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <img src={loginBg} alt="" className="absolute w-full h-full" />
        {
          <div className="w-full max-w-sm space-y-4 p-4 absolute">
            <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
              Please Log In to Play
            </h2>
            <form
              onSubmit={handleSubmit((data) => {
                dispatch(userLogin(data));
                resetField("password");
              })}
              className="mt-8 space-y-6"
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Username
                  </label>
                  <input
                    {...register("username")}
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="username"
                  />
                  <p className="text-red-600">{errors.username?.message}</p>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    {...register("password")}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                  <p className="text-red-600">{errors.password?.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    onClick={() => toggle()}
                    href="#"
                    className="text-[#fbc2d7] font-bold hover:text-[#fbc2d7]"
                  >
                    Forgot your password?
                  </a>
                </div>

                <div className="text-sm">
                  <Link
                    to="/register"
                    className="text-[#fbc2d7] font-bold hover:text-[#fbc2d7]"
                  >
                    Sign up
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#c83900] py-2 px-4 text-md font-medium text-[#fbc2d7] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <AiFillLock
                      className="h-5 w-5 text-[#fbc2d7] group-hover:text-[#a9637c]"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
            <div className="flex items-center space-x-4">
              <hr className="w-full border border-gray-300" />
              <div className="font-semibold text-white">OR</div>
              <hr className="w-full border border-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="#"
                className="text-center rounded-2xl bg-[#1cb0b0] py-2.5 px-4 font-bold text-[#fbcdd6] hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
              >
                <FacebookLogin
                  appId="2628824880593812"
                  fields="name,email,picture"
                  cssClass="my-custom-class"
                  callback={responseFacebook}
                  textButton="FACEBOOK"
                />
              </a>
              <a
                href="#"
                onClick={() => googleLogin()}
                className="text-center rounded-2xl  bg-[#971fbc] py-2.5 px-4 font-bold text-[#fbcdd6] hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
              >
                GOOGLE
              </a>
            </div>
          </div>
        }
        <Modal isShowing={isShowing} closeButton hide={toggle}>
          <div className="flex">
            <div
              className="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
              style={{
                backgroundImage:
                  "url('https://source.unsplash.com/oWTW-jNGl9I/600x800')",
              }}
            ></div>
            <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
              <div className="px-8 mb-4 text-center">
                <h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
                <p className="mb-4 text-sm text-gray-700">
                  We get it, stuff happens. Just enter your email address below
                  and we'll send you a link to reset your password!
                </p>
              </div>
              <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight bg-[#2b0d13] text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Enter Email Address..."
                  />
                </div>
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Reset Password
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <Link
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    to="/register"
                  >
                    Create an Account!
                  </Link>
                </div>
                <div className="text-center">
                  <Link
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    to="/login"
                  >
                    Already have an account? Login!
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </PageAnimation>
  );
};

export default Login;
