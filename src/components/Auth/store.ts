// src/context/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  is_questionnaire_filled: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  otp_mail: string | null;
  isAuthenticated: boolean;
}

let userFromLocalStorage = localStorage.getItem("user");
const storedUser = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;

const initialState: AuthState = {
  user: storedUser || null,
  token: localStorage.getItem("token") || null,
  otp_mail: null,
  isAuthenticated: !!storedUser,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", JSON.stringify(state.token));
      }
    },
    setOtpMail: (state, action: PayloadAction<string | null>) => {
      state.otp_mail = action.payload;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("otp_mail", JSON.stringify(state.otp_mail));
      }
    },
  },
});

export const { setUser, setToken, setOtpMail } = authSlice.actions;
export default authSlice.reducer;