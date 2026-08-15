import apiClient from './client';

export const createPayment = async (payload) => 
    (await apiClient.post('/payments', payload)).data;

export const getPayment = async (orderCode) =>
    (await apiClient.get(`/payments/${orderCode}`)).data;

export const verifyPayment = async (orderCode) =>
    (await apiClient.post(`/payments/${orderCode}/verify`)).data;