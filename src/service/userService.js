
import axios from '../config/axios';

const userService = {
  // all reviews
  getAllUsers: async (page = 1, limit = 10) => {
    const res = await axios.get(`/users?page=${page}&limit=${limit}`);
    
    return res.data;
   
  },
  // remove user 
  deleteUser: async (id) => {
    const res = await axios.delete(`/users/delete/${id}`);
    return res.data;
  },
};

export default userService;

