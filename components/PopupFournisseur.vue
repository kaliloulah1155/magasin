<template>
  <v-dialog width="500" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Ajouter" variant="flat" color="blue-lighten-4" size="small"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Ajouter un nouveau fournisseur">  
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Nom" color="primary" clearable variant="outlined" v-model="nom"
              :rules="inputRules"></v-text-field>
            <v-text-field label="Prénoms" color="primary" clearable variant="outlined" v-model="prenoms"
              :rules="inputRules"></v-text-field>
            <v-text-field label="Adresse" color="primary" clearable variant="outlined" v-model="adresse"
              :rules="inputRules"></v-text-field>
            <v-text-field label="E-mail" class="mt-2" color="primary" clearable variant="outlined" v-model="email"
              :rules="emailRules"></v-text-field>
            <v-select label="Sexe" class="mt-2" color="primary" variant="outlined" v-model="sexe" :items="sexe_statut"
              item-title="libelle" item-value="code" return-object></v-select>
            <v-text-field label="Téléphone" class="mt-2" color="primary" clearable variant="outlined" v-model="telephone"
              :rules="telephoneRules"></v-text-field>
            <v-file-input label="Photo" v-model="photo" accept="image/*" show-size counter
              variant="outlined"></v-file-input>
            <v-select label="Profil" class="mt-2" color="primary" variant="outlined" v-model="profil" :items="profils"
              item-title="libelle" item-value="id" return-object :rules="[v => !!v || 'Le profil est requis']"></v-select>
            <v-select label="Statut" class="mt-2" color="primary" variant="outlined" v-model="editedItem.statut"
              :items="item_statut" item-title="libelle" item-value="id" return-object></v-select>
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
  <v-snackbar v-model="snackbar" multi-line location="top" :color="err ? 'red-lighten-3' : 'green-lighten-3'">
    {{ msg }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  emits: ['saveItem'],
  props: {
    profils: Array,
    item_statut: Array,
    sexe_statut: Array,
  },
  data: () => ({
    snackbar: false,
    msg: '',
    err: false,
    photo: null,
    nom: '',
    prenoms: '',
    adresse: '',
    sexe: { libelle: 'Homme', code: "M" },
    telephone: "",
    email: "",
    editedItem: {
      id: 0,
      nom: "",
      prenoms: "",
      adresse: '',
      email: "",
      sexe: "",
      lib_sexe: "M",
      telephone: "",
      image: null,
      profil_id: 0,
      profil: "",
      statut: 1,
    },
    loading: false,
    inputRules: [
      (v) => (v && v.length >= 3) || "La longueur minimale est de 3 caractères",
    ],
    telephoneRules: [
      v => (v && /^\d+$/.test(v) && v.length === 10) || 'Entrez un nombre valide de 10 chiffres',
    ],
    emailRules: [
      v => (v && /.+@.+\..+/.test(v)) || 'Entrer une adresse e-mail valide',
    ],
    // Select parent
    profil: { libelle: 'Veuillez selectionner', id: null },
  }),

  methods: {
    async submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {

        if (this.profil.id !== null) {
          this.editedItem.image = this.photo ? this.photo : null;
          this.editedItem.nom = this.nom;
          this.editedItem.prenoms = this.prenoms;
          this.editedItem.adresse = this.adresse;
          this.editedItem.email = this.email;
          this.editedItem.telephone = this.telephone;
          this.editedItem.profil_id = this.profil;
          this.editedItem.sexe = this.sexe;

          this.$emit('saveItem', this.editedItem);
        } else {
          this.err = true;
          this.snackbar = true;
          this.msg = "OOPS !! Veuillez selectionner le profil"
        }

      }
      this.loading = false;
    },

  },
};
</script>


<style scoped></style>