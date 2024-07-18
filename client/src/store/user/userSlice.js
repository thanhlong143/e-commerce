import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
   name: "user",
   initialState: {
      isLoggedIn: false,
      current: null,
      token: null,
   },

   reducers: {
      register: (state, action) => {
         state.isLoggedIn = action.payload.isLoggedIn;
         state.current = action.payload.userData;
         state.access_token = action.payload.access_token;
      }
   },
});

export const { register } = userSlice.actions;

export default userSlice.reducer;