import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import sessionReducer from './sessionSlice'; // Adjust the path based on your folder structure
// Adjust the path based on your folder structure

export const store = configureStore( {
  reducer: {
    chat: chatReducer,
    sessions: sessionReducer,
  },
} );
