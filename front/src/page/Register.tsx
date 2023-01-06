import React, { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/image/bg-1.png";
import PageAnimation from "../style/PageAnimation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { clearErr, registerUser } from "../redux/userSlice";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import { useAlert } from "react-alert";

const schema = yup
  .object({
    username: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .max(25, "Please enter at least 5 characters")
      .required("This field is required"),
    email: yup
      .string()
      .email("Non-standard email, example: youremail@example.com")
      .required("This field is required"),
    password: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .max(25, "Please enter at least 5 characters")
      .required("This field is required"),
  })
  .required();

const Register = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [picture, setPicture] = useState("");
  const {
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const dispatch: (action: any) => void = useDispatch();
  const { userInfo, isFetching, error, errMsg } = useSelector(
    (state: any) => state.user
  );
  const {
    isShowing: showLoading,
    setIsShowing: setShowLoading,
    toggle: toggleLoading,
  } = useModal();
  useEffect(() => {
    userInfo !== null && navigate("/");
  }, [userInfo]);
  useEffect(() => {
    isFetching && setShowLoading(true);
    !isFetching && setShowLoading(false);
  }, [isFetching]);
  useEffect(() => {
    errMsg === "Request failed with status code 401" &&
      alert.error("User already exists");
    dispatch(clearErr());
  }, [isFetching]);
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        typeof Reader.result === "string" && setPicture(Reader.result);
      }
    };
  };

  return (
    <PageAnimation>
      <div className="flex min-h-full h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <img src={loginBg} alt="" className="absolute w-full h-full" />
        <div className="w-full absolute max-w-sm space-y-8 p-4 rounded-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Register new account
          </h2>

          <form
            onSubmit={handleSubmit((data) => {
              dispatch(registerUser({ ...data, picture: picture }));
              resetField("username");
              resetField("email");
              resetField("password");
            })}
            className="mt-8 space-y-6"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm flex flex-col gap-2">
              <div className="flex gap-4">
                <label htmlFor="avatar" className="text-white text-lg">
                  Avatar:
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  {...register("username", { required: true })}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Username"
                />
                <p className="text-red-600">{errors.username?.message}</p>
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  {...register("email", { required: true })}
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Email address"
                />
                <p className="text-red-600">{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
                <p className="text-red-600">{errors.password?.message}</p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isFetching}
                className={`group relative flex w-full justify-center rounded-md border border-transparent ${
                  isFetching ? "bg-[#cb9681]" : "bg-[#c83900]"
                } py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiFillLock
                    className="h-5 w-5 text-[#fbc2d7] group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Register
              </button>
            </div>
          </form>
          <div className="text-white mt-6">
            Already have an account?
            <Link
              className="no-underline border-b border-blue text-blue text-blue-600 ml-2"
              to="/login"
            >
              Log in
            </Link>
            .
          </div>
        </div>
      </div>
      <Modal isShowing={showLoading} hide={toggleLoading}>
        <div></div>
      </Modal>
    </PageAnimation>
  );
};

export default Register;
