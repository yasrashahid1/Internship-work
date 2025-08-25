import { createSlice } from "@reduxjs/toolkit";
import { fetchTickets, createTicket } from "./actions";

const initialState = {
  items: [],             
  status: "idle",       
  error: null,
  creating: "idle",      
  createError: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchTickets
    builder.addCase(fetchTickets.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Failed to load tickets";
    });

    // createTicket
    builder.addCase(createTicket.pending, (state) => {
      state.creating = "loading";
      state.createError = null;
    });
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.creating = "succeeded";
     
      state.items.unshift(action.payload);
    });
    builder.addCase(createTicket.rejected, (state, action) => {
      state.creating = "failed";
      state.createError = action.payload || "Failed to create ticket";
    });
  },
});

export default ticketsSlice.reducer;
