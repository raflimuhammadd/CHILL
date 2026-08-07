import { create } from "zustand";
import { registerUser, loginUser, updateUser } from "../../../services/authService";

const extractErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Terjadi kesalahan';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('chill-user') || 'null'),
  isLoading: false,
  error: null,

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser({
        username: credentials.username,
        password: credentials.password,
      });
      set({ user: null, isLoading: false });
      return true;
    } catch (err) {
      set({ error: extractErrorMessage(err), isLoading: false });
      return false;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUser({
        username: credentials.username,
        password: credentials.password,
      });
      const { accessToken, user } = result.data;

      const normalizedUser = {
        ...user,
        isPremium: Boolean(user.is_premium),
        subscriptionPlan: null,
      };
      localStorage.setItem('chill-token', accessToken);
      localStorage.setItem('chill-user', JSON.stringify(normalizedUser));
      set({ user: normalizedUser, isLoading: false });
      return true;
    } catch (err) {
      set({ error: extractErrorMessage(err), isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('chill-token');
    localStorage.removeItem('chill-user');
    set({ user: null, error: null });
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = useAuthStore.getState().user;
      const updatedUser = { ...currentUser, ...updates };

      const payload = {...currentUser, ...updates};
      if (payload.avatar) {
        payload.avatar_url = payload.avatar;
        delete payload.avatar;
      }
      await updateUser(payload);

      localStorage.setItem('chill-user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return true;
    } catch (err) {
      set({ error: extractErrorMessage(err), isLoading: false });
      return false;
    }
  },

  setPremium: async (planId = 'individual') => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const normalizedUser = { ...currentUser, isPremium: true, subscriptionPlan: planId };
    localStorage.setItem('chill-user', JSON.stringify(normalizedUser));
    set({ user: normalizedUser, isLoading: false });

    try {
      await updateUser({ ...currentUser, subscription_status: true });
    } catch (error) {
      console.log('Gagal sync plan ke backend:', error);
    }
  },

  removePremium: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    const updatedUser = { ...currentUser, isPremium: false, subscriptionPlan: null };
    localStorage.setItem('chill-user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));

export default useAuthStore;