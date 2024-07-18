import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getNewUsers = createAsyncThunk("user/newUsers", async (data, { rejectWithValue }) => {
   const response = await apis.apiGetUsers({ sort: "-createdAt" });
   if (!response.success) {
      return rejectWithValue(response);
   }
   return response.users;
})