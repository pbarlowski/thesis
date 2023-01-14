import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  token: string | null;
}

const initialState: UserState = {
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export const { setToken } = userSlice.actions;

export default userSlice.reducer;
