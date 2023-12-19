<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter un nouveau fournisseur">
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Fournisseur" color="primary" clearable variant="outlined" v-model="editedItem.fullname"
              :rules="inputRules"></v-text-field>
            <v-text-field label="E-mail" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.email" :rules="emailRules"></v-text-field>
            <v-text-field label="Adresse" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.adresse" :rules="inputRules"></v-text-field>
            <v-text-field label="Téléphone" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.telephone" :rules="telephoneRules"></v-text-field>
            <v-text-field label="Magasin" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.shopname" :rules="inputRules"></v-text-field>


          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="FERMER" variant="elevated" @click="isActive.value = false" size="small"></v-btn>
          <v-btn color="green-darken-3" variant="elevated" size="small" :loading="loading"
            @click.prevent="submit">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-snackbar v-model="snackbar">
    {{ text }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
    emits: ['saveItem'],
  data: () => ({
    snackbar: false,
    text: "message du snackbar",
    photo: null,
    editedItem: {
      id: 0,
      fullname: "",
      email: "",
      adresse: "",
      telephone: "",
      shopname: "",
    },
    loading: false,
    inputRules: [
      v => (v && v.length >= 2) || "La longueur minimale est de 2 caractères"
    ],
    telephoneRules: [
      v => (v && /^\d+$/.test(v) && v.length === 10) || 'Entrez un nombre valide de 10 chiffres',
    ],
    emailRules: [
      v => (v && /.+@.+\..+/.test(v)) || 'Entrer une adresse e-mail valide',
    ],
    // Select parent

  }),
  methods: {
    async submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        this.$emit('saveItem', this.editedItem);
      }
      this.loading = false;
    },

  },
};
</script>


<style scoped></style>