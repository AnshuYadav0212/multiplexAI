import axios from "axios";

export const deductCredits = async (userId, agent) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTHENTICATION_SERVICE_URL}/credit`,
      { userId, agent },
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
