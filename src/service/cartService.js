import axios from "../config/axios";

const fetchCartApi = async () => {
  const res = await axios.get("/carts/getcarts");

  return res.data.data[0].items;
};

export default fetchCartApi;
