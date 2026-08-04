import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    getWatchHistory,
    addWatchHistory,
    updateWatchHistory,
    deleteWatchHistory,
} from '../../../services/watchHistoryService';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchWatchHistory = createAsyncThunk(
    'watchHistory/fetchWatchHistory',
    async (historyData, {rejectWithValue}) => {
        try {
            const data = await getWatchHistory(historyData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addWatchHistoryItem = createAsyncThunk(
    'watchHistory/addWatchHistoryItem',
    async (historyData, {rejectWithValue}) => {
        try {
            const data = await addWatchHistory(historyData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const editWatchHistoryItem = createAsyncThunk(
    'watchHistory/editWatchHistory',
    async ({id, historyData}, {rejectWithValue}) => {
        try {
            const data = await updateWatchHistory(id, historyData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteWatchHistoryItem = createAsyncThunk(
    'watchHistory/deleteWatchHistoryItem',
    async (id, {rejectWithValue}) => {
        try {
            await deleteWatchHistory(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const watchHistorySlice = createSlice({
    name: 'watchHistory',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // fetch
            .addCase(fetchWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Gagal memuat history';
            })

            // add
            .addCase(addWatchHistoryItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addWatchHistoryItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addWatchHistoryItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Gagal menambah history';
            })

            // edit
            .addCase(editWatchHistoryItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editWatchHistoryItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(editWatchHistoryItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Gagal memperbarui history';
            })

            // delete
            .addCase(deleteWatchHistoryItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWatchHistoryItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    (item) => item.id !== action.payload
                );
            })
            .addCase(deleteWatchHistoryItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Gagal menghapus history';
            });
    }
})

export const {clearError} = watchHistorySlice.actions;
export default watchHistorySlice.reducer;