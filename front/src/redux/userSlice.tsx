import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

interface State {
  userInfo: object | null;
  isFetching: boolean;
  error: boolean;
  user: object[];
}

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  username: string;
}

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (params: LoginParams) => {
    const response = await api.post("/login", params);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/userRegister",
  async (params: RegisterParams) => {
    const response = await api.post("/register", params);
    return response.data;
  }
);

const initialState: State = {
  userInfo: null,
  isFetching: false,
  error: false,
  user: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginGoogle: (state, action) => {
      state.userInfo = action.payload;
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
      .addCase(registerUser.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
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

export const selectUser = (state: State) => state.user;

export const { loginGoogle } = userSlice.actions;

export default userSlice.reducer;
