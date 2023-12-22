import axios from "axios";

export default defineNuxtPlugin(async(app) => {
  
    return{
        provide:{
            axios:axios
        }
    }
});
