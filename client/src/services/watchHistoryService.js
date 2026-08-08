import apiClient from "./client";

export const getWatchHistory = async () => {
    const response = await apiClient.get('/watch-history',);
    return response.data;
};

export const addWatchHistory = async (historyData) => {
    const response = await apiClient.post('/watch-history', historyData);
    return response.data;
};

export const updateWatchHistory = async (contentId, historyData) => {
    const response = await apiClient.patch(`/watch-history/${contentId}`, historyData);
    return response.data;
};

export const deleteWatchHistory = async (contentId) => {
    const response = await apiClient.delete(`/watch-history/${contentId}`);
    return response.data;
};