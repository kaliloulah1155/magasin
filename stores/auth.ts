import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    data: {},
    userInfo: [],
  }),
  actions: {},
  persist: true, // Inclure persist ici
});
