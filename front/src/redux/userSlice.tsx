import { createSlice } from "@reduxjs/toolkit";

interface State {
  userInfo: object;
  isFetching: boolean;
  error: boolean;
  user: object[];
}

const initialState = {
  userInfo: null,
  isFetching: false,
  error: false,
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const selectUser = (state: State) => state.user;

export const {} = userSlice.actions;

export default userSlice.reducer;
