// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import userService from '../service/userService';

// //  Thunk pour récupérer tous les utilisateurs
// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, thunkAPI) => {
//     try {
//       const data = await userService.getAllUsers();

//       return data.data ? data.data : data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const deleteUser = createAsyncThunk("users/delete", async (id,thunkAPI) => {
//   try{
// const response= await userService.deleteUser(id);
// return id;
//   }
//   catch(error){
//          return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//   }
// });
// // Slice
// const usersSlice = createSlice({
//   name: 'users',
//   initialState: {
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload; // ici payload doit être un tableau d'utilisateurs
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//        .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter(
//           (user) => user._id !== action.payload
//         );
//       })
//       .addCase(deleteUser.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export default usersSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../service/userService";

//  Thunk pour récupérer tous les utilisateurs
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const data = await userService.getAllUsers(page, limit);

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
  try {
    const _response = await userService.deleteUser(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
// Slice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      hasNext: false,
      hasPrev: false,
    },
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
        state.users = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
