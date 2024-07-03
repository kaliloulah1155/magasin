<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>
</v-dialog>
</template>
<script>
export default {
  emits: ['saveItem'],
  props: {
  },
  data: () => ({
    
  }),
  methods: {
    

  },
};
</script>


<style scoped></style>