import auth from "@/components/Auth/store";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
