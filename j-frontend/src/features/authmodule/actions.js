import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";


export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.post("auth/login/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const me = await api.get("auth/me/");
      return me.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Invalid credentials");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("auth/register/", payload);
      if (data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      }
      return data.user ?? data; 
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Registration failed");
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("auth/me/");
      return data;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  return true;
});
