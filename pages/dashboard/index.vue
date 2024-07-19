<template>
    <div class="dashboard ma-4">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Dashboard</h1>
            </template>
        </v-banner>
        <v-container fluid>
        <v-row>
          <v-col cols="12" md="3">
            <v-card class=""  color="blue lighten-4" dark>
              <v-card-title>
                Nombre de ventes
              </v-card-title>
              <v-card-title>
                14
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class=""  color="green lighten-4" dark>
              <v-card-title>
                Nombre de ventes
              </v-card-title>
              <v-card-title>
                14
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class=""  color="red lighten-4" dark>
              <v-card-title>
                Nombre de ventes
              </v-card-title>
              <v-card-title>
                14
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class=""  color="blue lighten-4" dark>
              <v-card-title>
                Nombre de ventes
              </v-card-title>
              <v-card-title>
                14
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script setup>

import { useAuthStore } from '../../stores/auth'
 
definePageMeta({
    middleware: 'auth',
    layout: 'master'
})  

//Get Session of user
const authStore= useAuthStore()
const {  status } = useAuth()
    
 
if(status.value =="unauthenticated"){
    authStore.data={}
}


</script>


<style>
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