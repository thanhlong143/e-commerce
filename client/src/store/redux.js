import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";
import userSlice from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const commonConfig = {
   key: "shop/user",
   storage: storage,
}

const userConfig = {
   ...commonConfig,
   whitelist:["isLoggedIn", "access_token"],
}

export const store = configureStore({
   reducer: {
      app: appSlice,
      products: productSlice,
      user: persistReducer(userConfig, userSlice),
   },
});

export const persistor = persistStore(store);