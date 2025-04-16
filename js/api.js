// import axios from "axios";

const api = axios.create({
  baseURL: "https://wordbox-back-end.onrender.com/api",
});

export const getLetters = async () => {
  try {
    const response = await api.get(`/get_letters`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
