import api from "../../utils/axios";

export const createOrder = async (plan) => {
  try {
    const { data } = await api.post("/api/bill/order", { plan });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
