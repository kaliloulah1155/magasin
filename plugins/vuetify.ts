import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, md } from "vuetify/iconsets/md";

import { fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";


// Translations provided by Vuetify
import { en, fr } from "vuetify/locale";
import DateFnsAdapter from "@date-io/date-fns";
import enUS from "date-fns/locale/en-US";
import frFr from "date-fns/locale/fr";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    /*theme: {
      defaultTheme: "dark",
    }, */
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: "md",
      aliases,
      sets: {
        md,
        mdi,
        fa,
      },
    },
    locale: {
      locale: "fr",
      fallback: "en",
      messages: { fr, en },
    },
    date: {
      adapter: DateFnsAdapter,
      locale: {
        en: enUS,
        fr: frFr,
      },
    },
  });
  app.vueApp.use(vuetify);
});
