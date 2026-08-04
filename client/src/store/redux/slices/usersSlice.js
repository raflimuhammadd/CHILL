import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue}) => {
        try {
            const response = await fetch (
                import.meta.env.VITE_API_BASE_URL + 'users'
            );
            if (!response.ok) {
                throw new Error ('Gagal mengambil data users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder
            // request start -> loading == true
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // request success -> save on state
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })

            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Terjadi Kesalahan';
            })
    }
})

export default userSlice.reducer;