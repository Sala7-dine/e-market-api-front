import axios from "../config/axios";

const fetchCartApi = async () => {
  console.log("inside fetchCartApi");
  const res = await axios.get("/carts/getcarts");
  console.log("ressssssssssss", res.data.data[0].items);

  return res.data.data[0].items;
};

export default fetchCartApi
