import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

interface UserInfo {
  _id: string;
  username: string;
  name: string;
  email: string;
  picture: string;
}

interface State {
  userInfo: UserInfo | null;
  isFetching: boolean;
  error: boolean;
  errMsg: string | unknown;
}

interface RootState {
  user: State;
}

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  username: string;
  picture: String | undefined;
}

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (params: LoginParams) => {
    const response = await api.post("api/auth/login", params);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/userRegister",
  async (params: RegisterParams) => {
    const response = await api.post("api/auth/register", params);
    return response.data;
  }
);

const initialState: State = {
  userInfo: null,
  isFetching: false,
  error: false,
  errMsg: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginGoogle: (state, action) => {
      state.userInfo = action.payload;
    },
    logOut: (state) => {
      state.userInfo = null;
    },
    clearErr: (state) => {
      state.error = false;
      state.errMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = true;
        state.errMsg = action.error.message;
      })
      .addCase(userLogin.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userInfo = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const selectUser = (state: RootState) => state.user;

export const { loginGoogle, logOut, clearErr } = userSlice.actions;

export default userSlice.reducer;
