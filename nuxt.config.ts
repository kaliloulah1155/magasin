export default defineNuxtConfig({
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    globalAppMiddleware: true,
    baseURL: "https://pos789456123.kewoustore.com/api/v1",
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/", method: "post" },
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
  },
});
