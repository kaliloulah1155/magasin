<template>
  <div class="dashboard ma-4">
    <template v-if="accessRights.canView">
      <v-banner lines="one" color="warning">
        <template v-slot:text>
          <h1 class="text-grey mb-4">Salaires</h1>
        </template>

        <template v-if="accessRights.canCreate" v-slot:actions>
          <popup-salaire @saveItem="getItem" :salaries="salaries" />
        </template>
      </v-banner>
      <v-container fluid class="my-5">
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="view_list"></v-icon>&nbsp; Liste des salariés
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="search"
              density="compact"
              label="Rechercher un salarie"
              single-line
              flat
              hide-details
              variant="solo-filled"
            ></v-text-field>
          </v-card-title>
          <v-divider class="mt-5"></v-divider>
          <v-data-table
            v-model:search="search"
            :headers="headers"
            :items="salaires"
            :loading="salaireLength > 0 ? false : true"
            :sort-by="[{ key: 'fullname', order: 'asc' }]"
            items-per-page="10"
          >
            <template v-slot:top>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form class="px-3" ref="form">
                      <v-select
                        label="Nom complet"
                        class="mt-2"
                        color="primary"
                        variant="outlined"
                        v-model="editedItem.fullname"
                        :items="salaries"
                        item-title="fullname"
                        item-value="id"
                        return-object
                      ></v-select>
                      <v-text-field
                        label="Montant"
                        class="mt-2"
                        color="primary"
                        clearable
                        variant="outlined"
                        v-model="editedItem.montant"
                        :rules="montantRules"
                      ></v-text-field>
                      <v-text-field
                        label="Date de paiement"
                        class="mt-2"
                        color="primary"
                        clearable
                        variant="outlined"
                        v-model="editedItem.date_salaire"
                        :rules="[isDateValid]"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="elevated" size="small" @click="close">
                      Annuler
                    </v-btn>
                    <v-btn
                      color="green-darken-3"
                      variant="elevated"
                      size="small"
                      @click="save"
                    >
                      Valider
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card max-height="500px">
                  <div class="text-center mt-4">
                    <v-icon
                      icon="delete_forever"
                      color="red"
                      size="large"
                    ></v-icon>
                  </div>
                  <v-card-title class="text-h5 text-center"
                    >&Ecirc;tes-vous s&ucirc;re de supprimer ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      variant="elevated"
                      size="x-small"
                      @click="closeDelete"
                      >Annuler</v-btn
                    >
                    <v-btn
                      color="red-darken-3"
                      size="x-small"
                      variant="elevated"
                      @click="deleteItemConfirm"
                      >Confirmer</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="accessRights.canEdit"
                size="small"
                class="me-2"
                @click="editItem(item)"
              >
                edit_note
              </v-icon>
              <v-icon
                v-if="accessRights.canDelete"
                size="small"
                @click="deleteItem(item)"
              >
                delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </template>
    <template v-else>
      <v-sheet
        class="d-flex align-center justify-center mt-4 flex-wrap text-center mx-auto px-4"
        elevation="4"
        height="250"
        max-width="800"
        width="100%"
        rounded
      >
        <div>
          <h2 class="text-h4 font-weight-black text-orange">
            Vous n'avez pas les droits necessaires
          </h2>
        </div>
      </v-sheet>
    </template>
  </div>
  <v-snackbar
    v-model="snackbar"
    multi-line
    location="top"
    :color="err ? 'red-lighten-3' : 'green-lighten-3'"
  >
    {{ msg }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { useSalaireStore } from "../../stores/salaire";
export default {
  setup() {
    useHead({
      title: "Salaires",
    });
    definePageMeta({
      layout: "master",
    });
    const authStore = useAuthStore();
    const salaireStore = useSalaireStore();
    const { data, token } = useAuth();

    const accessRights = reactive({
      profil_id: data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
    });

    return { authStore, salaireStore, token, accessRights };
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    snackbar: false,
    msg: "",
    err: false,
    search: "",
    url: useRuntimeConfig().public.apiBase,
    headers: [
      { title: "Nom complet", align: "start", key: "fullname" },
      { title: "Montant", key: "montant" },
      { title: "Date de paiement", key: "date_salaire" },
      { title: "Actions", key: "actions", sortable: false },
    ],

    montantRules: [(v) => (v && /^\d+$/.test(v)) || "Entrez un montant"],
    salaries: [{ fullname: "Veuillez selectionner", id: null }],
    salaires: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      user_id: "",
      fullname: "",
      montant: "",
      date_salaire: "",
    },
    defaultItem: {
      id: 0,
      user_id: "",
      montant: "",
      date_salaire: "",
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "salaireStore.data"(newData, oldData) {
      if (newData.length > 0) {
        const extractedData = newData.map(({ id, fullname }) => ({
          id,
          fullname,
        }));

        // Filtrer les éléments déjà présents dans le tableau parents
        const filteredData = extractedData.filter(
          ({ id }) => !this.salaries.some((parent) => parent.id === id)
        );

        // Ajouter les éléments filtrés au tableau parents
        this.salaries = [...this.salaries, ...filteredData];
      }
    },
  },
  created() {
    this.initialize();
    this.employes_list();
    this.accessRights.canView = true;
    this.checkUserAccess();
  },
  methods: {
    async checkUserAccess() {
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "SALAIRES",
      };
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/test_permission`,
          checkjson,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );
        this.accessRights.canView = response.data[0].show;
        this.accessRights.canCreate = response.data[1].add;
        this.accessRights.canEdit = response.data[2].edit;
        this.accessRights.canDelete = response.data[4].supp;
      }
    },
    async initialize() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/salaires`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });

        if (response.data.data.length > 0) {
          this.salaires = response.data.data;
          //  this.salaireStore.data = response.data.data;
        }
      } else {
        this.afficherCnx();
      }
    },
    async employes_list() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(`${this.url}/employes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });

        if (response.data.data.length > 0) {
          this.salaries = response.data.data;
          this.salaireStore.data = response.data.data;
        }
      } else {
        this.afficherCnx();
      }
    },
    afficherCnx() {
      this.msg = "Connectez - vous! ou réessayez la connexion";
      this.err = true;
      this.snackbar = true;
    },
    afficherMsg(messg) {
      this.msg = messg;
      this.err = false;
      this.snackbar = true;
      this.initialize();
    },
    editItem(item) {
      this.editedIndex = this.salaires.indexOf(item);
      // Create a copy of the item
      this.editedItem = { ...item };
      // Remove spaces and "F CFA" from the "montant" key
      this.editedItem.montant = removeFCFAAndSpaces(this.editedItem.montant);
      // Set the dialog to true
      this.dialog = true;
    },
    async deleteData(id) {
      if (this.token) {
        const response = await useNuxtApp().$axios.delete(
          `${this.url}/salaires/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );
        if (response.status == 201) {
          this.afficherMsg("Suppression effectuée avec succès");
        }
      } else {
        this.afficherCnx();
      }
    },
    deleteItem(item) {
      this.editedItem = this.salaires.indexOf(item);
      this.editedIndex = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.$nextTick(() => {
        this.deleteData(this.editedIndex.id);
      });
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async createData(json) {
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/salaires`,
          json,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );

        if (response.status == 200) {
          this.afficherMsg("Paiement effectué avec succès");
        }
      } else {
        this.afficherCnx();
      }
    },
    getItem(fromPopup) {
      let updatedItem = {
        ...fromPopup,
      };

      if (fromPopup.user_id && fromPopup.user_id.hasOwnProperty("fullname")) {
        updatedItem.user_id = fromPopup.user_id.id;
      }

      this.createData(updatedItem);
    },
    async updateData(json) {
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/salaires/${json.id}`,
          json,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );
        if (response.status == 200) {
          this.afficherMsg("Mise à jour effectué avec succès");
        }
      } else {
        this.afficherCnx();
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        let updatedObject = { ...this.editedItem }; // Créez une copie de l'objet initial

        if (
          this.editedItem.fullname &&
          this.editedItem.fullname.hasOwnProperty("fullname")
        ) {
          updatedObject.user_id = this.editedItem.fullname.id;
        }

        this.updateData(updatedObject);
      }

      this.close();
    },

    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    isValidDate(day, month, year) {
      const daysInMonth = [
        31,
        this.isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];
      return (
        month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1]
      );
    },
    isDateValid(v) {
      if (!v || !/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        return "Entrez une date valide au format DD/MM/YYYY";
      }

      const [day, month, year] = v.split("/").map(Number);

      if (!this.isValidDate(day, month, year)) {
        return "Entrez une date valide avec le nombre correct de jours et de mois.";
      }

      return true;
    },
  },
  computed: {
    salaireLength() {
      return this.salaires.length;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Nouveau paiement"
        : "Modifier un paiement";
    },
  },
};
</script>
<style scoped></style>
