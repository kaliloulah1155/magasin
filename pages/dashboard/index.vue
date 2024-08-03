<template>
  <v-container fluid>
    <DashAdmin  v-if="data.profile_code=='SAD' || data.profile_code=='AD'"/>
    <DashCaisse  v-if="data.profile_code=='CAI'"/>
  </v-container>
</template>

<script setup>
import { useAuthStore } from "../../stores/auth";

useHead({
  title: "Dashboard",
});
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

<style scoped>

</style>
