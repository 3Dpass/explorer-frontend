import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://explorer-api.3dpass.org/graphql/",
  params: {},
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
