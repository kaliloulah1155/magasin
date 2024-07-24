<template>
  <v-container fluid>
    <div class="mt-6">
      <!-- Wrap with ClientOnly -->
      <ClientOnly>

        
          <BarChart  />
          
          <LineChart />
            
      </ClientOnly>
      <!-- or use the `.client.vue` extension -->
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
const { data,status } = useAuth();

if (status.value == "unauthenticated") {
  authStore.data = {};
}
</script>

<style>
.headline {
  font-size: 24px;
  font-weight: bold;
}
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  font-size: 16px;
}
</style>
