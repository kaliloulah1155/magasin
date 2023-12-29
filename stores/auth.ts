import { defineStore } from "pinia";
export const useAuthStore = defineStore(
  "auth",
  {
    state: () => ({
      data: {},
    }),
    actions: {},
  },
  {
    persist: true,
  }
);
