export default defineNuxtConfig({
  modules: [
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt"
  ],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  runtimeConfig: {
    apiSecret: "", // can be overridden by NUXT_API_SECRET environment variable
    public: {
      //"https://pos789456123.kewoustore.com/api/v1"
      //http://127.0.0.1
      apiBase: "http://127.0.0.1:8000/api/v1", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      pwdForUser:"password2024"
    },
  },
  auth: {
    globalAppMiddleware: true,
    baseURL: "http://127.0.0.1:8000/api/v1",
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        signUp: { path: "/register", method: "post" },
        getSession: { path: "/infoUser", method: "get" },
      },
      pages: {
        login: "/",
      },   
    },
  },
  devtools: { enabled: true },
  css: [
    "vuetify/dist/vuetify.css",
    "@mdi/font/css/materialdesignicons.min.css",
    "material-design-icons-iconfont/dist/material-design-icons.css",
    "~/assets/scss/main.scss"
  ],
  build: {
    transpile: ["vuetify", "axios"],
  },
  app: {
    head: {
      title: "POS",
      meta: [
        { name: "description", content: "Plateforme de mise à place d'un pos" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.8.95/css/materialdesignicons.css",
        },
        
      ],
    },
  },
  experimental: {
    inlineSSRStyles: false,
  }
});
