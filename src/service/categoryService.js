import axios from "../config/axios";

const categoryService = {
  // all categories
  getAllCategories: async () => {
    const res = await axios.get("/categories");
    return res.data;
  },
  // create categories
  createCategory: async (data) => {
    const res = await axios.post("/categories/create", data);
    return res.data;
  },
  // update category
  updateCategory: async (id, data) => {
    const res = await axios.put(`/categories/update/${id}`, data);
    return res.data;
  },
  // remove category
  deleteCategory: async (id) => {
    const res = await axios.delete(`/categories/delete/${id}`);
    return res.data;
  },
};

export default categoryService;
