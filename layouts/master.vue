<template  >
        <v-app :theme="theme" id="inspire" class="zoomed-content">
                <Navbar />
                <v-main>
                        <slot />
                </v-main>
        </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const theme = ref('light')

  function onClick () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
</script>

<style scoped>
.zoomed-content {
        /*transform: scale(0.9);*/
        zoom:70%;
       
}
</style>
 