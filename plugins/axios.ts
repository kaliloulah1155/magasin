
import axios from "axios";
const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/", // Replace with your API base URL
});

export default defineNuxtPlugin(async(app) => {
  
   app.provide("axios", instance);
});