<template>
  <div class="dashboard ma-4">
    <template v-if="accessRights.canView">
      <v-banner lines="one" color="blue-darken-2">
        <template v-slot:text>
          <h1 class="text-grey mb-4">Produits</h1>
        </template>
        <template v-if="accessRights.canCreate" v-slot:actions>
          <popup-produit
            @saveItem="getItem"
            :list_cats="categories"
            :fournisseurs="fournisseurs"
          />
        </template>
      </v-banner>
      <v-container fluid class="my-5">
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="view_list"></v-icon>&nbsp; Liste des produits

            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="search"
              density="compact"
              label="Rechercher un produit"
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
            :items="produits"
            :loading="produitLength > 0 ? false : true"
            :sort-by="[{ key: 'libelle', order: 'asc' }]"
            items-per-page="10"
          >
            <template v-slot:item.categories="{ item }">
              <template v-for="(cat, index) in item.categories">
                {{ cat }}
                <span v-if="index !== item.categories.length - 1">, </span>
              </template>
            </template>

            <template v-slot:top>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="750">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form class="px-3" ref="form">
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Libellé"
                            color="primary"
                            clearable
                            variant="outlined"
                            v-model="editedItem.libelle"
                            :rules="inputRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Prix d'achat"
                            class="mt-2"
                            color="primary"
                            clearable
                            variant="outlined"
                            v-model="editedItem.buying_price"
                            :rules="digitRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Prix de vente"
                            class="mt-2"
                            color="primary"
                            clearable
                            variant="outlined"
                            v-model="editedItem.selling_price"
                            :rules="digitRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-select
                            label="Fournisseur"
                            class="mt-2"
                            color="primary"
                            variant="outlined"
                            v-model="editedItem.fournisseur"
                            :items="fournisseurs"
                            item-title="fullname"
                            item-value="id"
                            return-object
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-combobox
                            label="Catégories"
                            chips
                            multiple
                            clearable
                            class="mt-2"
                            color="primary"
                            variant="outlined"
                            v-model="editedItem.categories"
                            :items="categories"
                            item-title="libelle"
                            item-value="id"
                            return-object
                          ></v-combobox>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Quantité"
                            class="mt-2"
                            color="primary"
                            clearable
                            variant="outlined"
                            v-model="editedItem.quantite"
                            :rules="digitRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-file-input
                            label="Image"
                            v-model="photo"
                            accept="image/*"
                            show-size
                            counter
                            variant="outlined"
                          ></v-file-input>
                        </v-col>
                      </v-row>
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
            <template v-slot:item.image="{ item }">
              <v-card class="my-2" elevation="2" rounded>
                <v-img
                  :src="item.image ? `${item.image}` : '/img/product.png'"
                  height="64"
                  cover
                  @click="openDialogImg(item.image)"
                  class="clickable-image"
                ></v-img>
              </v-card>
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
  <v-dialog v-model="dialogImg" max-width="600">
    <v-card>
      <v-img
        :src="selectedImage ? selectedImage : '/img/profil.png'"
        aspect-ratio="16/9"
      ></v-img>
    </v-card>
  </v-dialog>
</template>
<script>
import { useProduitStore } from "../../stores/produit";
export default {
  setup() {
    useHead({
      title: "Produits",
    });
    definePageMeta({
      layout: "master",
    });
    const authStore = useAuthStore();
    const produitStore = useProduitStore();
    const { data, token } = useAuth();
    const accessRights = reactive({
      profil_id: data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
    });
    return { authStore, produitStore, token, accessRights };
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogImg: false,
    selectedImage: null,
    snackbar: false,
    msg: "",
    err: false,
    search: "",
    url: useRuntimeConfig().public.apiBase,
    image: null,
    headers: [
      { title: "Libellé", align: "start", key: "libelle" },
      { title: "Code", key: "code" },
      { title: "Prix d'achat", key: "buying_price" },
      { title: "Prix de vente", key: "selling_price" },
      { title: "Image", key: "image" },
      { title: "Fournisseurs", key: "fournisseur" },
      { title: "Catégories", key: "categories" },
      { title: "Quantité", key: "quantite" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    inputRules: [
      (v) => (v && v.length >= 3) || "La longueur minimale est de 3 caractères",
    ],
    digitRules: [(v) => (v && /^\d+$/.test(v)) || "Entrez des chiffres"],
    categories: [],
    fournisseurs: [{ fullname: "Veuillez selectionner", id: null }],
    produits: [],
    photo: null,
    editedIndex: -1,
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
      quantite: 0,
    },
    defaultItem: {
      id: 0,
      libelle: "",
      code: "",
      buying_price: 0,
      selling_price: 0,
      fournisseur_id: null,
      fournisseur: "",
      categories: "",
      image: null,
      quantite: 0,
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "produitStore.data"(newData, oldData) {
      if (newData.length > 0) {
        const extractedData = newData.map(({ id, fullname }) => ({
          id,
          fullname,
        }));

        // Filtrer les éléments déjà présents dans le tableau parents
        const filteredData = extractedData.filter(
          ({ id }) => !this.fournisseurs.some((parent) => parent.id === id)
        );

        // Ajouter les éléments filtrés au tableau parents
        this.fournisseurs = [...this.fournisseurs, ...filteredData];
      }
    },
    "produitStore.cats"(newData, oldData) {
      if (newData.length > 0) {
        const extractedData = newData.map(({ id, libelle }) => ({
          id,
          libelle,
        }));

        // Filtrer les éléments déjà présents dans le tableau parents
        const filteredData = extractedData.filter(
          ({ id }) => !this.categories.some((parent) => parent.id === id)
        );

        // Ajouter les éléments filtrés au tableau parents
        this.categories = [...this.categories, ...filteredData];
      }
    },
  },
  created() {
    this.initialize();
    this.fournisseurs_list();
    this.accessRights.canView = true;
    this.checkUserAccess();
  },
  mounted() {
    this.categories_list();
  },
  methods: {
    async checkUserAccess() {
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "PRODUITS",
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
        const response = await useNuxtApp().$axios.get(`${this.url}/produits`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${this.token}`,
          },
        });

        if (response.data.data.length > 0) {
          this.produits = response.data.data;
          this.produitStore.data = response.data.data;
        }
      } else {
        this.afficherCnx();
      }
    },

    async categories_list() {
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
          //this.categories = response.data.data;
          this.produitStore.cats = response.data.data;
        }
      } else {
        this.afficherCnx();
      }
    },
    async fournisseurs_list() {
      if (this.token) {
        const response = await useNuxtApp().$axios.get(
          `${this.url}/fournisseurs`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );

        if (response.data.data.length > 0) {
          let reponses = response.data.data;
          const fournisseursInfo = reponses.map((fournisseur) => {
            return {
              id: fournisseur.id,
              fullname: fournisseur.fullname,
            };
          });
          this.fournisseurs = fournisseursInfo;

          this.produitStore.data = response.data.data;
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
      this.editedIndex = this.produits.indexOf(item);
      // Create a copy of the item
      this.editedItem = { ...item };
      // Remove spaces and "F CFA" from the "montant" key
      this.editedItem.buying_price = parseInt(
        removeFCFAAndSpaces(this.editedItem.buying_price)
      );
      this.editedItem.selling_price = parseInt(
        removeFCFAAndSpaces(this.editedItem.selling_price)
      );
      // Set the dialog to true
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedItem = this.produits.indexOf(item);
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
    save() {
      if (this.editedIndex > -1) {
        let updatedObject = { ...this.editedItem }; // Créez une copie de l'objet initial
        if (
          this.editedItem.fournisseur &&
          this.editedItem.fournisseur.hasOwnProperty("fullname")
        ) {
          updatedObject.fournisseur_id = this.editedItem.fournisseur.id;
        }

        if (this.photo) {
          updatedObject.image = this.photo;
        }

        if (updatedObject.categories[0] !== null) {
          const categoryIds = updatedObject.categories.map(
            (updatedCategory) => {
              // Recherche de l'objet correspondant dans this.categories en fonction du libellé
              if (
                updatedCategory.libelle &&
                updatedCategory.hasOwnProperty("libelle")
              ) {
                updatedCategory = updatedCategory.libelle;
              }
              const matchedCategory = this.categories.find(
                (category) => category.libelle === updatedCategory
              );
              // Récupération de l'identifiant de l'objet s'il est trouvé, sinon retourner null
              return matchedCategory ? matchedCategory.id : null;
            }
          );
          const uniqueCategoryIds = Array.from(new Set(categoryIds)); //retirer les doublons
          updatedObject.categories = uniqueCategoryIds;
        }
        this.updateData(updatedObject);
      }
      this.close();
    },
    async updateData(json) {
      if (this.token) {
        const formData = new FormData();

        // Ajoutez les champs à formData
        formData.append("id", parseInt(json.id));
        formData.append("libelle", json.libelle);
        formData.append("fournisseur_id", parseInt(json.fournisseur_id));
        formData.append("buying_price", parseInt(json.buying_price));
        formData.append("selling_price", parseInt(json.selling_price));
        // Ajoutez ici la logique pour le fichier (s'il existe)
        if (json.image) {
          formData.append("image", json.image[0]);
        }
        formData.append("quantite", parseInt(json.quantite));

        //formData.append('categories', JSON.stringify(json.categories));
        // const idsArray = json.categories.map(category => category.id);
        formData.append("categories", JSON.stringify(json.categories));
        // formData.append('categories', json.categories);

        const response = await useNuxtApp().$axios.post(
          `${this.url}/produits/${json.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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
    async createData(json) {
      const formData = new FormData();
      // Ajoutez les champs à formData
      formData.append("libelle", json.libelle);
      formData.append("fournisseur_id", parseInt(json.fournisseur_id));
      formData.append("buying_price", parseInt(json.buying_price));
      formData.append("selling_price", parseInt(json.selling_price));
      // Ajoutez ici la logique pour le fichier (s'il existe)
      if (json.image) {
        formData.append("image", json.image[0]);
      }
      formData.append("quantite", parseInt(json.quantite));
      formData.append("categories", JSON.stringify(json.categories));

      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/produits`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${this.token}`,
            },
          }
        );

        if (response.status == 200) {
          this.afficherMsg("Produit créé avec succès");
        }
      } else {
        this.afficherCnx();
      }
    },
    async deleteData(id) {
      if (this.token) {
        const response = await useNuxtApp().$axios.delete(
          `${this.url}/produits/${id}`,
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
    getItem(fromPopup) {
      let updatedItem = {
        ...fromPopup,
      };

      if (
        updatedItem.fournisseur_id &&
        updatedItem.fournisseur_id.hasOwnProperty("fullname")
      ) {
        updatedItem.fournisseur_id = updatedItem.fournisseur_id.id;
      }

      if (updatedItem.categories[0] !== null) {
        const categoryIds = updatedItem.categories.map((updatedCategory) => {
          // Recherche de l'objet correspondant dans this.categories en fonction du libellé
          if (
            updatedCategory.libelle &&
            updatedCategory.hasOwnProperty("libelle")
          ) {
            updatedCategory = updatedCategory.libelle;
          }
          const matchedCategory = this.categories.find(
            (category) => category.libelle === updatedCategory
          );
          // Récupération de l'identifiant de l'objet s'il est trouvé, sinon retourner null
          return matchedCategory ? matchedCategory.id : null;
        });
        const uniqueCategoryIds = Array.from(new Set(categoryIds)); //retirer les doublons
        updatedItem.categories = uniqueCategoryIds;
      }

      this.createData(updatedItem);
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    openDialogImg(image) {
      this.selectedImage = image;
      this.dialogImg = true;
    },
  },
  computed: {
    produitLength() {
      return this.produits.length;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Nouveau produit"
        : "Modifier un produit";
    },
  },
};
</script>
<style scoped></style>
