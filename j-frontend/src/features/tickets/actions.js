import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchTickets = createAsyncThunk("tickets/fetchAll", async () => {
  const { data } = await api.get("tickets/"); 
  return data;
});

export const createTicket = createAsyncThunk("tickets/create", async (payload) => {
  const { data } = await api.post("tickets/", payload);   
  return data;
});


export const updateTicket = createAsyncThunk("tickets/update", async ({ id, data: body }) => {
  const { data } = await api.patch(`tickets/${id}/`, body); 
  return data;
});
