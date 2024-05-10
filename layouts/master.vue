<template  >
        <v-app id="inspire" class="zoomed-content" >
                <Navbar />
                <v-main>
                        <slot />
                </v-main>
        </v-app>
</template>

<script setup>
import { ref } from 'vue'
 
</script>
<style scoped>
.zoomed-content {
        /*transform: scale(0.9);*/
        zoom:70%;
       
}
</style>
 