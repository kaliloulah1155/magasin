<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <!-- Carte pour le nombre total de clients -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          color="error"
          rounded="xl"
          variant="tonal"
          elevation="3"
          hover
          href="/ventes"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h5 text-black text-center">
              Ventes Récentes
            </div>
          </template>

          <template v-slot:text>
            <div class="float-left text-black mt-3">
              <div class="text-subtitle-1">
                Nombre de vente (
                <v-badge color="brown-lighten-5" text-color="black" inline>
                  <template #badge>
                    <span class="custom-badge">26</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
            <div class="float-right text-black mt-3">
              <div class="text-h5 mt-3 pb-3">
                {{ moneyFormat(2540500) }} F CFA
              </div>
            </div>
          </template>
        </v-card>
      </v-col>
      <!-- Carte pour le nombre de nouveaux utilisateurs -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          color="#00FF00"
          rounded="xl"
          variant="tonal"
          elevation="3"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h5 text-black text-center">
              Bénéfices des Ventes
            </div>
          </template>

          <template v-slot:text>
            <div class="text-center text-black mt-3">
              <div class="text-h5 mt-5">{{ moneyFormat(500000) }} F CFA</div>
            </div>
          </template>
        </v-card>
      </v-col>
      <!-- Carte pour l'augmentation des ventes -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          color="primary"
          rounded="xl"
          variant="tonal"
          elevation="3"
          hover
          href="/depenses"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h5 text-black text-center">
              Dépenses
            </div>
          </template>

          <template v-slot:text>
            <div class="float-left text-black mt-3">
              <div class="text-subtitle-1">
                Nombre (
                <v-badge color="brown-lighten-5" text-color="black" inline>
                  <template #badge>
                    <span class="custom-badge">4</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
            <div class="float-right text-black mt-3">
              <div class="text-h5 mt-5">{{ moneyFormat(24500) }} F CFA</div>
            </div>
          </template>
        </v-card>
      </v-col>
      <!-- Carte pour les ventes -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          color="tel"
          rounded="xl"
          variant="tonal"
          elevation="3"
          hover
          href="/produits"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h5 text-center">Produits</div>
          </template>
          <template v-slot:text>
            <div class="d-flex justify-center justify-space-around mt-3">
              <div class="text-subtitle-1">
                Nombre (
                <v-badge color="brown-lighten-5" text-color="black" inline>
                  <template #badge>
                    <span class="custom-badge">16</span>
                  </template>
                </v-badge>
                )
              </div>

              <div class="text-subtitle-1">
                Rupture (
                <v-badge color="error" text-color="white" inline>
                  <template #badge>
                    <span class="custom-badge">16</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
            <div class="d-flex justify-center justify-space-around mt-3">
              <div class="text-subtitle-1">
                Rupture en cours (
                <v-badge color="error" text-color="white" inline>
                  <template #badge>
                    <span class="custom-badge">6</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center mt-6">
      <v-col cols="3">
        <v-text-field
          v-model="dt_debut"
          type="date"
          variant="outlined"
          clearable
          class="w-2"
        >
          <template v-slot:label>
            <span class="dt-custom-label text-h6">Date de début</span>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="dt_fin" type="date" variant="outlined" clearable>
          <template v-slot:label>
            <span class="dt-custom-label text-h6">Date de fin</span>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn
          size="x-small"
          icon="search"
          color="green"
          class="mt-3"
          title="Filtrage"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Wrap with ClientOnly -->
    <ClientOnly>
      <v-container>
        <v-tabs
          v-model="tab"
          bg-color="deep-purple-darken-4"
          align-tabs="center"
          center-active
        >
          <v-tab value="one">Mes Ventes journalières</v-tab>
          <v-tab value="two">Produits critiques et à réapprovisionner</v-tab>
          <v-tab value="three">Top 10 des produits</v-tab>
          <v-tab value="four">Top 10 des ventes</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="one">
            <TabDaily />
          </v-window-item>
          <v-window-item value="two">
            <TabRupture />
          </v-window-item>
          <v-window-item value="three">
            <v-row justify="center" class="mt-3">
              <v-col cols="12" class="w-100" md="8" xs="12">
                <PieChart />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item value="four">
            <v-row justify="center" class="mt-3">
              <v-col cols="12" md="8" xs="12">
                <BarYChart />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-container>
    </ClientOnly>
    <!-- or use the `.client.vue` extension -->
  </v-container>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

useHead({
  title: "Dashboard",
});
definePageMeta({
  middleware: "auth",
  layout: "master",
});

//Get Session of user
const authStore = useAuthStore();
const { data, status } = useAuth();
if (status.value == "unauthenticated") {
  authStore.data = {};
}

const dt_debut = ref(null);
const dt_fin = ref(null);

let tab = ref("one");
</script>

<style scoped>
.custom-badge {
  font-size: 1rem !important;
}

.chart-container {
  height: 400px;
}
</style>
