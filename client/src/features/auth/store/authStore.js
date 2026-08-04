import { create } from "zustand";
import { registerUser, loginUser, updateUser } from "../../../services/authService";

const planNameMap = {
    individual: 'Individual',
    duo: 'Berdua',
    family: 'Keluarga',
};

const planIdMap = {
  Individual: 'individual',
  Berdua: 'duo',
  Keluarga: 'family',
}

const useAuthStore = create((set) => ({
  // ── State ──
  user: JSON.parse(localStorage.getItem('chill-user') || 'null'),
  isLoading: false,
  error: null,

  // ── Actions ──
  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await registerUser({
        ...credentials,
        full_name: '',
        email: '',
        isPremium: false,
        subscription_status: false,
        subscriptionPlan: null,
        avatar: '',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('chill-user', JSON.stringify(newUser));
      set({ user: newUser, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const users = await loginUser(credentials.username);
      if (users.length === 0) {
        set({ error: 'Username tidak ditemukan', isLoading: false });
        return false;
      }
      const foundUser = users[0];
      if (foundUser.password !== credentials.password) {
        set({ error: 'Kata sandi salah', isLoading: false });
        return false;
      }

      const normalizedUser = {
        ...foundUser,
        isPremium: Boolean(foundUser.subscription_status ?? foundUser.isPremium),
        subscriptionPlan: foundUser.subscriptionPlan ?? planIdMap[foundUser.plan] ?? null,
      };
      localStorage.setItem('chill-user', JSON.stringify(normalizedUser));
      set({ user: normalizedUser, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('chill-user');
    set({ user: null, error: null });
  },

  updateProfile: async (updates) => {
    set({isLoading: true, error: null});
    try {
      const currentUser = useAuthStore.getState().user;
      const apiPayload = {...currentUser, ...updates};
      if ('isPremium' in updates) {
        apiPayload.subscription_status = updates.isPremium;
        delete apiPayload.isPremium;
      }
      const updatedUser = await updateUser(currentUser.id, apiPayload);
      const normalizedUser = {
        ...updatedUser,
        isPremium: Boolean(updatedUser.subscription_status ?? updatedUser.isPremium),
      };
      localStorage.setItem('chill-user', JSON.stringify(normalizedUser));
      set({user: updatedUser, isLoading: false});
      return true;
    } catch (err) {
      set({error: err.message, isLoading: false});
      return false;
    }
  },



  setPremium: async (planId = 'individual') => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const normalizedUser = {
      ...currentUser, 
      isPremium: true, 
      subscriptionPlan: planId
    };
    localStorage.setItem('chill-user', JSON.stringify(normalizedUser));
    set({user: normalizedUser, isLoading: false});

    // sync to mockapi
    try {
      await updateUser(currentUser.id, {
        ...currentUser,
        subscription_status: true,
        plan: planNameMap[planId] || 'Premium',
      });
    } catch (error) {
      console.log('Gagal sync plan ke mockAPI:', error);
    }
  },

  removePremium: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    const updateUser = {...currentUser, isPremium: false, subscriptionPlan: null};
    localStorage.setItem('chill-user', JSON.stringify(updateUser));
    set({user: updateUser});
  }
}));

export default useAuthStore;