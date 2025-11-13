import axios from '../config/axios';

const userService = {
  getAllUsers: async () => {
    const res = await axios.get("/users");
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await axios.delete(`/users/${id}`);
    return res.data;
  },
};

export default userService;
