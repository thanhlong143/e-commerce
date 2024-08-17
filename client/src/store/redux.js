import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import productSlice from "./products/productSlice";
import userSlice from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import {
   persistStore, persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from "redux-persist";

const commonConfig = {
   storage: storage
}

const userConfig = {
   ...commonConfig,
   whitelist: ["isLoggedIn", "access_token", "current", "currentCart"],
   key: "shop/user"
}

const productConfig = {
   ...commonConfig,
   whitelist: ["dealDaily"],
   key: "shop/deal"
}

export const store = configureStore({
   reducer: {
      app: appSlice,
      products: persistReducer(productConfig, productSlice),
      user: persistReducer(userConfig, userSlice),
   },
   middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false
   }),
});

export const persistor = persistStore(store);