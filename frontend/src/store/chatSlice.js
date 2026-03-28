import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    createdChats: [], // Array of created chats
  },
  reducers: {
    addChat: (state, action) => {
      state.createdChats.push(action.payload);
    },
  },
});

export const { addChat } = chatSlice.actions;

export default chatSlice.reducer;
