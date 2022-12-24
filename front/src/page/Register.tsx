import React, { useEffect } from "react";
import { AiFillLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/image/bg-1.png";
import PageAnimation from "../style/PageAnimation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/userSlice";
import { AppThunk } from "redux-toolkit";

const schema = yup
  .object({
    username: yup
      .string()
      .min(5, "Vui lòng nhập tối thiểu 5 kí tự")
      .max(25, "Vui lòng nhập tối đa 25 kí tự")
      .required("Vui lòng không để trống"),
    email: yup
      .string()
      .email("Email không đúng chuẩn, ví dụ: youremail@example.com")
      .required("Vui lòng không để trống"),
    password: yup
      .string()
      .min(5, "Vui lòng nhập tối thiểu 5 kí tự")
      .max(25, "Vui lòng nhập tối đa 25 kí tự")
      .required("Vui lòng không để trống"),
  })
  .required();

const Register = () => {
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
      email: "",
      password: "",
    },
  });
  const dispatch: (action: any) => void = useDispatch();
  const { isFetching } = useSelector((state: any) => state.user);
  const { userInfo } = useSelector((state: any) => state.user);

  useEffect(() => {
    userInfo !== null && navigate("/");
  }, [userInfo]);

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
              dispatch(registerUser(data));
              console.log(data);
              resetField("username");
              resetField("email");
              resetField("password");
            })}
            className="mt-8 space-y-6"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm flex flex-col gap-2">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  id="email-address"
                  {...register("username", { required: true })}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Username"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  {...register("email", { required: true })}
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isFetching}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#c83900] py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
    </PageAnimation>
  );
};

export default Register;
