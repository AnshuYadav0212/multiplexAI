import api from "../../utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await api.post("/api/chat/conversation");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
