import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authmodule/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  // tickets: ticketsReducer,
  // projects: projectsReducer,
});

export default rootReducer;
