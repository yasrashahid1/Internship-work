import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authmodule/reducer";
import { ticketsReducer } from "../features/tickets";  

const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketsReducer,    
  });

export default rootReducer;
