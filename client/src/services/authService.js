import apiClient from "./client";

export const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
}

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
}

export const getCurrentUser = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
}

export const updateUser = async (userData) => {
    const response = await apiClient.patch('/users/me', userData);
    return response.data;
}

export const resendVerificationEmail = async () => {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
}

export const refreshAccessToken = async () => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
}

export const logoutUser = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
}

export const getFavorites = async () => {
    const response = await apiClient.get('/users/favorites');
    return response.data;
}

export const addFavorite = async (contentId) => {
    const response = await apiClient.post('/users/favorites', { contentId });
    return response.data;
}

export const removeFavorite = async (contentId) => {
    const response = await apiClient.delete(`/users/favorites/${contentId}`);
    return response.data;
}