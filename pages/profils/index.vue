<template>
    <div class="dashboard ma-4">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Gestion des profils</h1>
            </template>
        </v-banner>
    </div>
</template>
<script>
    export default {
     setup() {
         definePageMeta({
             layout: 'master'
         })
         const authStore = useAuthStore()
         const { token } = useAuth()
         return { authStore, token, }
     },

     



    }
</script>