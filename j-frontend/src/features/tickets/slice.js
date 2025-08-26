import { createSlice } from "@reduxjs/toolkit";
import { fetchTickets, createTicket, updateTicket, deleteTicket } from "./actions";

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
      state.error = action.error?.message || "Failed to load tickets";
    });



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
      state.createError = action.error?.message || "Failed to create ticket";
    });

   

    builder.addCase(updateTicket.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.items.findIndex((t) => t.id === updated.id);
      if (idx !== -1) {
        state.items[idx] = updated;
      }
    });


    
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((t) => t.id !== id);
    });
  },
});

export default ticketsSlice.reducer;
