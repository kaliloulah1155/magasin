<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter un nouveau produit">
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Libellé" color="primary" clearable variant="outlined"
                                              v-model="editedItem.libelle" :rules="inputRules"></v-text-field>
                                          <v-text-field label="Code" class="mt-2" color="primary" clearable
                                              variant="outlined" v-model="editedItem.code"></v-text-field>
                                          <v-text-field label="Prix d'achat" class="mt-2" color="primary" clearable
                                              variant="outlined" v-model="editedItem.buying_price"
                                              :rules="digitRules"></v-text-field>
                                           <v-text-field label="Prix de vente" class="mt-2" color="primary" clearable
                                                  variant="outlined" v-model="editedItem.selling_price"
                                                  :rules="digitRules"></v-text-field>
                                               <v-select label="Fournisseur" class="mt-2" color="primary" variant="outlined"
                                                      v-model="editedItem.fournisseur" :items="fournisseurs" item-title="libelle"
                                                      item-value="id" return-object></v-select>
                                               <v-select label="Catégorie" class="mt-2" color="primary" variant="outlined"
                                                  v-model="editedItem.categorie" :items="categories" item-title="libelle"
                                                  item-value="id" return-object></v-select>
                                          <v-file-input label="Image" v-model="image" accept="image/*" show-size counter
                                              variant="outlined"></v-file-input>
                                          <v-text-field label="Quantité" class="mt-2" color="primary" clearable
                                                  variant="outlined" v-model="editedItem.quantite"
                                                  :rules="digitRules"></v-text-field>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="FERMER" variant="elevated" @click="isActive.value = false" size="small"></v-btn>
          <v-btn color="green-darken-3" variant="elevated" size="small" :loading="loading"
            @click.prevent="submit">Enregistrer</v-btn>
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
    image:null,
    editedItem: {
      id: 0,
      libelle: "",
      code: "",
      buying_price: 0,
      selling_price: 0,
      fournisseur: "",
      categorie: "",
      image: null,
      quantite: 0
    },
    loading: false,
      categories: [
      { libelle: "Lait", id: 1 },
      { libelle: 'Crème', id: 2 },
      { libelle: 'Lotion', id: 3 },
    ],
    fournisseurs: [
      { libelle: "Awa", id: 1 },
      { libelle: 'Moye', id: 2 },
      { libelle: 'Autre', id: 3 },
    ],
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
        this.snackbar = true;
        this.$emit('saveItem', this.editedItem);
      }
      this.loading = false;
    },

    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },
    isValidDate(day, month, year) {
      const daysInMonth = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
    },
    isDateValid(v) {
      if (!v || !/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        return 'Entrez une date valide au format DD/MM/YYYY';
      }

      const [day, month, year] = v.split('/').map(Number);

      if (!this.isValidDate(day, month, year)) {
        return 'Entrez une date valide avec le nombre correct de jours et de mois.';
      }

      return true;
    },

  },
};
</script>


<style scoped></style>