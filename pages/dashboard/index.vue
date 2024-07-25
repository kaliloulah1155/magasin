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
            <div class="font-weight-bold text-h5 text-black text-center">Dépenses</div>
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
              <div class="text-h5 mt-5"> {{ moneyFormat(2000)}} F CFA </div>
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
            <div class="font-weight-bold text-h5 text-black text-center">Salaires</div>
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
              <div class="text-h5 mt-5"> {{ moneyFormat(300000)}} F CFA </div>
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
            <div class="font-weight-bold text-h5 text-black text-center">Bénéfice</div>
          </template>
         
          <template v-slot:text>
            <div class="text-center text-black mt-3">
              <div class="text-h5 mt-5"> {{ moneyFormat(500000)}} F CFA </div>
               </div>
          </template>
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
 
.custom-badge{
  font-size: 1rem!important;
}
</style>
