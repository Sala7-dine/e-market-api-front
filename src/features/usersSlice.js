import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../service/userService';

// 🔹 Thunk pour récupérer tous les utilisateurs
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const data = await userService.getAllUsers();
     
      return data.data ? data.data : data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  try{
const response= await userService.deleteUser(id);
return response;
  }
  catch(error){
         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); 
  }
});
// 🔹 Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // ici payload doit être un tableau d'utilisateurs
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
