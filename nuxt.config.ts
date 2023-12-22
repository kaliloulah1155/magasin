 

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "vuetify/dist/vuetify.css",
    "@mdi/font/css/materialdesignicons.min.css",
    "material-design-icons-iconfont/dist/material-design-icons.css",
  ],
  build: {
    transpile: ["vuetify","pinia","axios"],
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
