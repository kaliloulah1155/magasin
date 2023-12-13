import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    "vuetify/dist/vuetify.css",
    "@mdi/font/css/materialdesignicons.min.css",
    "material-design-icons-iconfont/dist/material-design-icons.css",
  ],
  build: {
    transpile: ["vuetify"],
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
    /**
     * see: https://v3.nuxtjs.org/api/configuration/nuxt.config#inlinessrstyles
     */
    inlineSSRStyles: false
  },
});
