<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter un nouveau salaire">
        <v-card-text>
          <v-form class="px-3" ref="form">
              <v-select label="Nom complet" class="mt-2" color="primary" variant="outlined" v-model="employe" :items="salaries"
                item-title="fullname" item-value="id" persistent-hint return-object></v-select>
            <v-text-field label="Montant" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.montant" :rules="montantRules"></v-text-field>
            <v-text-field label="Date de paiement" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.date_salaire" :rules="[isDateValid]"></v-text-field>

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
  props: {
    salaries: Array,
  },
  data: () => ({
    editedItem: {
      id: 0,
      user_id: "",
      montant: "",
      date_salaire: "",
    },
    loading: false,
    employe: { fullname: 'Veuillez selectionner', id: null },
    montantRules: [
      v => (v && /^\d+$/.test(v)) || 'Entrez un montant',
    ],
    // Select parent

  }),
  methods: {
    async submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        this.editedItem.user_id = this.employe;
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