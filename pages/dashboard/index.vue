<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <!-- Carte pour les ventes -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          rounded="xl"
          variant="flat"
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
                    <span class="custom-badge">0</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
            <div class="float-right text-black mt-3">
              <div class="text-h5 mt-5">{{ moneyFormat(2000) }} F CFA</div>
            </div>
          </template>
        </v-card>
      </v-col>
      <!-- Carte pour le nombre total de clients -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto h-100"
          color="error"
          rounded="xl"
          variant="tonal"
          elevation="3"
          hover
          href="/salaires"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h5 text-black text-center">
              Salaires
            </div>
          </template>

          <template v-slot:text>
            <div class="float-left text-black mt-3">
              <div class="text-subtitle-1">
                Nombre de personne (
                <v-badge color="brown-lighten-5" text-color="black" inline>
                  <template #badge>
                    <span class="custom-badge">2</span>
                  </template>
                </v-badge>
                )
              </div>
            </div>
            <div class="float-right text-black mt-3">
              <div class="text-h5 mt-3 pb-3">
                {{ moneyFormat(300000) }} F CFA
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
              Bénéfice
            </div>
          </template>

          <template v-slot:text>
            <div class="text-center text-black mt-3">
              <div class="text-h5 mt-5">{{ moneyFormat(500000) }} F CFA</div>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="6" md="3">
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
      <v-col cols="6" md="3">
        <v-text-field v-model="dt_fin" type="date" variant="outlined" clearable>
          <template v-slot:label>
            <span class="dt-custom-label text-h6">Date de fin</span>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
        <!-- Wrap with ClientOnly -->
        <ClientOnly>
          <v-col cols="12" md="6" xs="12">
            <v-card class="text-white py-4" color="">
              <PieChart />
            </v-card>
          </v-col>
          <v-col cols="12" md="6" xs="12" >
            <v-card class="text-white py-4" color="">
              <BarYChart />
            </v-card>
          </v-col>
        </ClientOnly>
        <!-- or use the `.client.vue` extension -->
      </v-row>
  </v-container>

 
</template>

<script setup>
import { useAuthStore } from "../../stores/auth";
 
definePageMeta({
  middleware: "auth",
  layout: "master",
});

//Get Session of user
const authStore = useAuthStore();
const { status } = useAuth();

if (status.value == "unauthenticated") {
  authStore.data = {};
}

const dt_debut = ref(null);
const dt_fin = ref(null);
</script>

<style scoped>
.custom-badge {
  font-size: 1rem !important;
}
</style>
