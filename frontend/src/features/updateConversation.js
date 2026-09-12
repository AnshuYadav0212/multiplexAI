import React from "react";
import api from "../../utils/axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await api.patch(
      `/api/chat/conversation/${payload.conversationId}`,
      { title: payload.title },
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
