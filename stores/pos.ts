import { defineStore } from "pinia";
 

 
export const usePosStore = defineStore("pos", {
  state: () => ({
 
    fourns: [],
    paid_methods: [],
    produits: [],
  }),
  actions: {
 
  },
});
