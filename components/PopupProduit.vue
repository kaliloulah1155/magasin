<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter un nouveau produit">


        
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Libellé" color="primary" clearable variant="outlined" v-model="editedItem.libelle"
              :rules="inputRules"></v-text-field>
            <v-text-field label="Prix d'achat" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.buying_price" :rules="digitRules"></v-text-field>
            <v-text-field label="Prix de vente" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.selling_price" :rules="digitRules"></v-text-field>
            <v-select label="Fournisseur" class="mt-2" color="primary" variant="outlined" v-model="fournisseur"
              :items="fournisseurs" item-title="fullname" item-value="id" return-object></v-select>
            <v-combobox label="Catégories" chips multiple clearable class="mt-2" color="primary" variant="outlined"
              v-model="categorie" :items="list_cats" item-title="libelle" item-value="id" return-object></v-combobox>
            <v-file-input label="Image" v-model="photo" accept="image/*" show-size counter
              variant="outlined"></v-file-input>
            <v-text-field label="Quantité" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.quantite" :rules="digitRules"></v-text-field>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="FERMER" variant="elevated" @click="isActive.value = false" size="small"></v-btn>
          <v-btn color="green-darken-3" variant="elevated" size="small" :loading="loading"
            @click.prevent="submit">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

</template>

<script>    
export default {
  emits: ['saveItem'],
   props:{
       list_cats:Array,
       fournisseurs:Array,
  },
  data: () => ({

    photo: null,
    editedItem: {
      id: 0,  
      libelle: "",
      code: "",
      buying_price: 0,
      selling_price: 0,
      fournisseur_id: null,
      fournisseur: "",
      categories: "",
      image: null,
      quantite: 0
    },
    loading: false,
    categorie: [],
    fournisseur: [{ fullname: 'Veuillez selectionner', id: null }],
    inputRules: [
      v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
    ],
    digitRules: [
      v => (v && /^\d+$/.test(v)) || 'Entrez des chiffres',
    ],
    // Select parent

  }),
  methods: {
    async submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        this.editedItem.image = this.photo ? this.photo : null;
        this.editedItem.fournisseur_id = this.fournisseur;
        this.editedItem.categories = this.categorie;
        this.$emit('saveItem', this.editedItem);
      }
      this.loading = false;
    },

   

  },
};
</script>


<style scoped></style>