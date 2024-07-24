<template>
  <v-container fluid>
    <v-row>
      <!-- Carte pour les ventes -->
      <v-col cols="12" md="3">
        <v-card
          border="opacity-50 sm"
          class="mx-auto h-100"
          max-width="360"
          rounded="xl"
          variant="text"
        >
          <template v-slot:title>
            <div class="font-weight-bold text-h6 text-center">Produits</div>
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
        <v-card class="white--text py-4" color="teal-darken-4">
          <v-card-title> Revenu Total </v-card-title>
          <v-card-text class="text-h3 mt-5"> 23,569 </v-card-text>
        </v-card>
      </v-col>
      <!-- Carte pour le nombre total de clients -->
      <v-col cols="12" md="3">
        <v-card class="white--text py-4" color="blue-darken-4">
          <v-card-title> Revenu Total </v-card-title>
          <v-card-text class="text-h3 mt-5"> 23,569 </v-card-text>
        </v-card>
      </v-col>
      <!-- Carte pour le nombre de nouveaux utilisateurs -->
      <v-col cols="12" md="3">
        <v-card class="white--text py-4" color="red-darken-4">
          <v-card-title> Revenu Total </v-card-title>
          <v-card-text class="text-h3 mt-5"> 23,569 </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <div class="mt-6">
      <v-row>
        <!-- Wrap with ClientOnly -->
        <ClientOnly>
          <v-col cols="" md="6">
            <v-card class="white--text py-4" color="">
              <BarChart />
            </v-card>
          </v-col>

          <v-col cols="" md="6">
            <v-card class="white--text py-4" color="">
              <LineChart />
            </v-card>
          </v-col>
        </ClientOnly>
        <!-- or use the `.client.vue` extension -->
      </v-row>
    </div>
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
const { data, status } = useAuth();

if (status.value == "unauthenticated") {
  authStore.data = {};
}
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(88, 8, 238, 0.909);
}
.v-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.v-card-subtitle {
  text-align: center;
  font-size: 20px;
}
.v-card-text {
  text-align: center;
}
.custom-badge{
  font-size: 1rem!important;
}
</style>
