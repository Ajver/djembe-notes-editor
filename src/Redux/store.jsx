import { configureStore } from "@reduxjs/toolkit";
import rhythmSlice from "./rhythmSlice";
import selectionSlice from "./selectionSlice";

export default configureStore({
  reducer: {
    rhythm: rhythmSlice,
    selection: selectionSlice,
  },
})
