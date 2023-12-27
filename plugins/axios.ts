
import axios from "axios";
const instance = axios.create({
  baseURL: "https://pos789456123.kewoustore.com/api/v1/", // Replace with your API base URL
});

export default defineNuxtPlugin(async(app) => {
  
   app.provide("axios", instance);
});
