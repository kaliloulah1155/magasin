<template>
    <div class="dashboard ma-4">
        <template v-if="accessRights.canView">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Stocks</h1>
            </template>
  
        </v-banner>
        <v-container fluid class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des produits en stocks
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un produit" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="produits"
                    :loading="produitLength > 0 ? false : true" :sort-by="[{ key: 'libelle', order: 'asc' }]"
                    items-per-page="10">


                    <template v-slot:item.image="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="item.image ? `${item.image}` : '/img/product.png'" height="64" cover></v-img>
                        </v-card>
                    </template>

                    <template v-slot:item.categories="{ item }">
                        <template v-for="(cat, index) in item.categories">
                                 {{ cat }}
                                 <span v-if="index !== item.categories.length - 1">, </span>
                    </template>
                           
                    </template>

                    <template v-slot:item.stock="{ item }">
                        <v-chip :color="item.quantite > 0 ? 'green' : 'red'" label size="small">
                            {{ item.stock }}
                        </v-chip>
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
import { useStockStore } from '../../stores/stock'
export default {
    setup() {   
        definePageMeta({
            layout: 'master'
        })
          const authStore = useAuthStore()
        const stockStore = useStockStore()
        const { data,token } = useAuth()

        const accessRights = reactive({
       profil_id:data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
    });

        return { authStore, stockStore, token,accessRights }
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        snackbar: false,
        msg: '',
        err: false,
        search: "",
        url: useRuntimeConfig().public.apiBase,
        headers: [
            { title: "Libellé", align: "start", key: 'libelle' },
            { title: "Code", key: "code" },
            { title: "Prix d'achat", key: "buying_price" },
            { title: "Image", key: "image" },
            { title: "Fournisseurs", key: "fournisseur" },
            { title: "Catégories", key: "categories" },
            { title: "Quantité", key: "quantite" },
            { title: "Stock", key: "stock" },
        ],
        produits: [],


    }),

    watch: {

    },
    created() {
        this.initialize()
        this.accessRights.canView=true;
        this.checkUserAccess();
    },
    methods: {
        async checkUserAccess(){
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "STOCKS",
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
                const response = await useNuxtApp().$axios.get(`${this.url}/produits_stock`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.produits = response.data.data;
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

    },
    computed: {
        produitLength() {
            return this.produits.length;
        },

    }
}
</script>
<style scoped></style>