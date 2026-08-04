import apiClient from "./client";

export const registerUser = async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
}

export const loginUser = async (username) => {
    const response = await apiClient.get('/users', {
        params: {username}
    });
    return response.data;
}

export const getUserById = async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
}

export const updateUser = async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
}