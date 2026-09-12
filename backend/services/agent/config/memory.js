import redis from "../../../shared/redis/redis.js";
import dotenv from "dotenv";
import { getMessages } from "../utils/getMessages.js";
export const getMemory = async (conversationId) => {
  const key = `conversation-${conversationId}`;
  const cache = await redis.get(key);
  if (cache) {
    return JSON.parse(cache);
  }

  const messages = await getMessages(conversationId);
  await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  return messages;
};

export const addMessage = async (conversationId, role, content) => {
  const key = `conversation-${conversationId}`;
  const rawMessages = await redis.get(key);
  const messages = rawMessages ? JSON.parse(rawMessages) : [];
  messages.push({
    role,
    content,
  });

  if (messages.length > 20) {
    messages.shift();
  }
  await redis.set(key, JSON.stringify(messages));
};
