import axios from "../config/axios";

const categoryService = {
    getAllCategories: async () => {
        const res = await axios.get('/categories');
        return res.data;
    },

    createCategory: async (data) => {
        const res = await axios.post('/categories/create', data);
        return res.data;
    },

    updateCategory: async (id, data) => {
        const res = await axios.put(`/categories/update/${id}`, data);
        return res.data;
    },

    deleteCategory: async (id) => {
        const res = await axios.delete(`/categories/delete/${id}`);
        return res.data;
    }
};

export default categoryService;