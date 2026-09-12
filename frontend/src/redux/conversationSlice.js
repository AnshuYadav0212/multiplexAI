import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConversationTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((convers) =>
        convers._id == conversationId ? { ...convers, title } : convers,
      );
      if (state.selectedConversation?._id == conversationId) {
        state.selectedConversation = {
          ...state.selectedConversation,
          title,
        };
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setConversationTitle,
  setSelectedConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
