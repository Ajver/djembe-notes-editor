import { configureStore } from "@reduxjs/toolkit";
import rhythmSlice from "./rhythmSlice";

export default configureStore({
  reducer: {
    rhythm: rhythmSlice,
  },
})
