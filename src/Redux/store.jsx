import { configureStore } from "@reduxjs/toolkit";
import rhythmSlice from "./rhythmSlice";
import editorSlice from "./editorSlice";
import modalsSlice from "./modalsSlice";

export default configureStore({
  reducer: {
    rhythm: rhythmSlice,
    editor: editorSlice,
    modals: modalsSlice,
  },
})
