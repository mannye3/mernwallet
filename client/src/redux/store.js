import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
