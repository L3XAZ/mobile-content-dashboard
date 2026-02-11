import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<{ user: Partial<User> }>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user };
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice;
