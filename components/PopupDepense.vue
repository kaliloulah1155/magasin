<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter une dépense">
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-textarea label="Détail" class="mt-2" color="primary" clearable variant="outlined" rows="1" auto-grow
              v-model="editedItem.detail" :rules="detailRules"></v-textarea>
            <v-text-field label="Montant" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.montant" :rules="montantRules"></v-text-field>
            <v-text-field label="Date de dépense" class="mt-2" color="primary" clearable variant="outlined"
              v-model="editedItem.created_at" :rules="[isDateValid]"></v-text-field>

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
    editedItem: {
      id: 0,
      detail: "",
      montant: "",
      created_at: "",
    },
    loading: false,
    detailRules: [
      v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
    ],
    montantRules: [
      v => (v && /^\d+$/.test(v)) || 'Entrez un montant',
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