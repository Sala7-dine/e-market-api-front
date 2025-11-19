// import axios from '../config/axios';

// const userService = {
//   getAllUsers: async () => {
//     const res = await axios.get("/users");
    
//     return res.data;
   
//   },
//   deleteUser: async (id) => {
//     const res = await axios.delete(`/users/delete/${id}`);
//     return res.data;
//   },
// };

// export default userService;
import axios from '../config/axios';

const userService = {
  getAllUsers: async (page = 1, limit = 10) => {
    const res = await axios.get(`/users?page=${page}&limit=${limit}`);
    
    return res.data;
   
  },
  deleteUser: async (id) => {
    const res = await axios.delete(`/users/delete/${id}`);
    return res.data;
  },
};

export default userService;

