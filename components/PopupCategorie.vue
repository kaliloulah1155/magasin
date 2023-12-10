<template>
    <v-dialog width="500" transition="dialog-bottom-transition">
      <template v-slot:activator="{ props }">
        <v-btn  v-bind="props"  text="Ajouter"  variant="flat" color="blue-lighten-4" size="small"></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close Dialog"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
</template>

<script setup>

</script>

<style scoped>

</style>