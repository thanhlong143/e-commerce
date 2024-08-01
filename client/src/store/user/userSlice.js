import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
   name: "user",
   initialState: {
      isLoggedIn: false,
      current: null,
      access_token: null,
      isPending: false,
      message: ""
   },
   reducers: {
      login: (state, action) => {
         state.isLoggedIn = action.payload.isLoggedIn;
         state.access_token = action.payload.access_token;
      },
      logout: (state, action) => {
         state.isLoggedIn = false;
         state.current = null;
         state.access_token = null;
         state.isPending = false;
         state.message = ""
      },
      clearMessage: (state) => {
         state.message = "";
      }
   },
   extraReducers: (builder) => {
      builder.addCase(actions.getCurrent.pending, (state) => {
         state.isLoading = true;
      });

      builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
         state.isLoading = false;
         state.current = action.payload;
         state.isLoggedIn = true;
      });

      builder.addCase(actions.getCurrent.rejected, (state, action) => {
         state.isLoading = false;
         state.current = null;
         state.isLoggedIn = false;
         state.access_token = null;
         state.message = "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại!"
      });
   }
});

export const { login, logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;