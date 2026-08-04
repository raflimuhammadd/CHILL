import apiClient from "./client";

export const getWatchHistory = async (userId) => {
    const response = await apiClient.get('/watch-history', {
        params: { userId }
    });
    return response.data;
};

export const addWatchHistory = async (historyData) => {
    const response = await apiClient.post('/watch-history', historyData);
    return response.data;
};

export const updateWatchHistory = async (id, historyData) => {
    const response = await apiClient.put(`/watch-history/${id}`, historyData);
    return response.data;
};

export const deleteWatchHistory = async (id) => {
    const response = await apiClient.delete(`/watch-history/${id}`);
    return response.data;
};