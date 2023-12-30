<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter une nouvelle catégorie">
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Libellé" color="primary" clearable variant="outlined" v-model="libelle"
              :rules="inputRules"></v-text-field>
            <v-select label="Parent" class="mt-2" color="primary" variant="outlined" v-model="parent" :items="parent_cats"
              item-title="libelle" item-value="id" persistent-hint return-object></v-select>
            <v-text-field label="Position" class="mt-2" type="number" color="primary" clearable variant="outlined"
              v-model="position"></v-text-field>


            <v-select label="Statut" class="mt-2" color="primary" variant="outlined" v-model="statut" :items="item_statut"
              item-title="state" item-value="abbr" return-object></v-select>


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
       parent_cats:Array
  },
  data: () => ({
 
    libelle: '',
    code: '',
    statut: { state: 'Activée', abbr: 1 },
    item_statut: [
      { state: 'Activée', abbr: 1 },
      { state: 'Désactivée', abbr: 0 },

    ],
    editedItem: {
      id: 0,
      libelle: '',
      parent: '',
      slug:'POD',
      position: 0,
      statut: 1,
    },
    position: 0,
    loading: false,
    inputRules: [
      v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
    ],
    //Select parent
    parent: { libelle: 'Veuillez selectionner', id: null },
   
  }),
  methods: {
    async submit() {
      this.loading = true
      if (this.$refs.form.validate()) {

        this.editedItem.libelle = this.libelle
        this.editedItem.parent = this.parent
        this.editedItem.code = this.code
        this.editedItem.position = this.position
        this.editedItem.statut = this.statut
        this.$emit('saveItem', this.editedItem);

      }

      this.loading = false
    }
  }
}

</script>

<style scoped></style>