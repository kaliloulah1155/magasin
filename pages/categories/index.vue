<template>
  <div class="dashboard ma-4">
    <template v-if="accessRights.canView">
      <v-banner lines="one" color="warning">
        <template v-slot:text>
          <h1 class="text-subtitle-1 text-grey">Catégories</h1>
        </template>
        <template v-slot:actions>
          <popup-categorie @saveItem="getItem" :parent_cats="parents" />
        </template>
      </v-banner>
      <v-container fluid class="my-5">
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="view_list"></v-icon>&nbsp; Liste des catégories
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="search"
              density="compact"
              label="Rechercher une catégorie"
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
            :items="categories"
            :loading="categorieLength > 0 ? false : true"
            :sort-by="[{ key: 'libelle', order: 'asc' }]"
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
                      <v-text-field
                        label="Libellé"
                        color="primary"
                        clearable
                        variant="outlined"
                        v-model="editedItem.libelle"
                        :rules="inputRules"
                      ></v-text-field>
                      <v-select
                        label="Parent"
                        class="mt-2"
                        color="primary"
                        variant="outlined"
                        v-model="editedItem.parent"
                        :items="parents"
                        item-title="libelle"
                        item-value="id"
                      ></v-select>

                      <v-text-field
                        label="Position"
                        class="mt-2"
                        type="number"
                        color="primary"
                        clearable
                        variant="outlined"
                        v-model="editedItem.position"
                      ></v-text-field>
                      <v-select
                        label="statut"
                        class="mt-2"
                        color="primary"
                        variant="outlined"
                        v-model="editedItem.statut"
                        :items="item_statut"
                        item-title="state"
                        item-value="abbr"
                        return-object
                      ></v-select>
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
            <template v-slot:item.statut="{ item }">
              <template v-if="item.statut == 1">
                <v-chip
                  color="green"
                  text="Activée"
                  class="text-uppercase"
                  label
                  size="small"
                >
                </v-chip>
              </template>
              <template v-if="item.statut == 0">
                <v-chip
                  color="red"
                  text="Desactivée"
                  class="text-uppercase"
                  label
                  size="small"
                >
                </v-chip>
              </template>
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
import { useCategorieStore } from "../../stores/categorie";
import { useAuthStore } from "../../stores/auth";

export default {
  setup() {
    useHead({
      title: "Catégories",
    });
    definePageMeta({
      layout: "master",
    });
    const categorieStore = useCategorieStore();
    const authStore = useAuthStore();
    const { data, token } = useAuth();

    const accessRights = reactive({
      profil_id: data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
    });

    return { categorieStore, authStore, token, accessRights };
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
      {
        title: "Libellé",
        align: "start",
        sortable: true,
        key: "libelle",
      },
      { title: "Parent", key: "parent" },
      { title: "Position", key: "position" },
      { title: "Statut", key: "statut" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    inputRules: [
      (v) => (v && v.length >= 3) || "La longueur minimale est de 3 caractères",
    ],
    parents: [{ libelle: "Veuillez selectionner", id: null }],
    categories: [],
    editedIndex: -1,
    statut: { state: "Activée", abbr: 1 },
    item_statut: [
      { state: "Activée", abbr: 1 },
      { state: "Désactivée", abbr: 0 },
    ],
    editedItem: {
      id: 0,
      libelle: "",
      parent: "",
      code: "",
      position: 0,
      statut: 1,
    },
    defaultItem: {
      id: 0,
      libelle: "",
      parent: "",
      code: "",
      position: 0,
      statut: 1,
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "categorieStore.data"(newData, oldData) {
      if (newData.length > 0) {
        const extractedData = newData.map(({ id, libelle }) => ({
          id,
          libelle,
        }));

        // Filtrer les éléments déjà présents dans le tableau parents
        const filteredData = extractedData.filter(
          ({ id }) => !this.parents.some((parent) => parent.id === id)
        );

        // Ajouter les éléments filtrés au tableau parents
        this.parents = [...this.parents, ...filteredData];
      }
    },
  },
  created() {
    this.accessRights.canView = true;
    this.checkUserAccess();
  },
  mounted() {
    this.initialize();
  },
  methods: {
    async checkUserAccess() {
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "CATEGORIES",
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
        const response = await useNuxtApp().$axios.get(
          `${this.url}/categories_slug/POD`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );

        if (response.data.data.length > 0) {
          this.categories = response.data.data;
          this.categorieStore.data = response.data.data;
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
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedItem = this.categories.indexOf(item);
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
          `${this.url}/categories`,
          json,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );

        if (response.status == 200) {
          this.afficherMsg("Catégorie créé avec succès");
        }
      } else {
        this.afficherCnx();
      }
    },
    async updateData(json) {
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/categories/${json.id}`,
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
    async deleteData(id) {
      if (this.token) {
        const response = await useNuxtApp().$axios.delete(
          `${this.url}/categories/${id}`,
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
    save() {
      if (this.editedIndex > -1) {
        if (
          this.editedItem.statut &&
          this.editedItem.statut.hasOwnProperty("state")
        ) {
          let updatedObject = {
            ...this.editedItem,
            statut: this.editedItem.statut.abbr,
          };
          //Traitement de la mise à jour en base
          this.updateData(updatedObject);
        } else {
          this.updateData(this.editedItem);
        }
      }

      this.close();
    },
    getItem(fromPopup) {
      if (
        fromPopup.statut &&
        fromPopup.statut.hasOwnProperty("state") &&
        fromPopup.parent &&
        fromPopup.parent.hasOwnProperty("libelle")
      ) {
        let updatedItem = {
          ...fromPopup,
          statut: fromPopup.statut.abbr,
          parent: fromPopup.parent.id == 0 ? null : fromPopup.parent.id,
        };

        this.createData(updatedItem);
        //this.categories.push(updatedItem)
      }
    },
    closeDelete() {
      this.dialogDelete = false;
    },
  },
  computed: {
    categorieLength() {
      return this.categories.length;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Nouvelle catégorie"
        : "Modifier une catégorie";
    },
  },
};
</script>
<style scoped></style>
