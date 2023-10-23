import { configureStore } from "@reduxjs/toolkit";
import rhythmSlice from "./rhythmSlice";
import editorSlice from "./editorSlice";

export default configureStore({
  reducer: {
    rhythm: rhythmSlice,
    editor: editorSlice,
  },
})
