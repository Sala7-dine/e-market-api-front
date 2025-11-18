import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import categoryService from '../service/categoryService';

const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await categoryService.getAllCategories();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const createCategory = createAsyncThunk(
    'categories/create',
    async (data, thunkAPI) => {
        try {
            const response = await categoryService.createCategory(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await categoryService.updateCategory(id, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id,thunkAPI) => {
        try {
            await categoryService.deleteCategory(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.payload;
            })
           .addCase(updateCategory.fulfilled, (state, action) => {
  const index = state.categories.findIndex(c => c._id === action.payload._id);
  if(index !== -1) {
    state.categories[index] = action.payload; 
  }
})

            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(cat => cat._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export { fetchCategories, createCategory, updateCategory, deleteCategory };
export default categorySlice.reducer;