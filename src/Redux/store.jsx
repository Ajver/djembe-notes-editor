import { configureStore } from "@reduxjs/toolkit";
import rhythmSlice from "./rhythmSlice";
import editorSlice from "./editorSlice";
import modalsSlice from "./modalsSlice";
import playerSlice from "./playerSlice";
import layoutSlice from "./layoutSlice";

export default configureStore({
  reducer: {
    rhythm: rhythmSlice,
    editor: editorSlice,
    modals: modalsSlice,
    player: playerSlice,
    layout: layoutSlice,
  },
})
