<template>
    <div class="dashboard ma-4">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Stocks</h1>
            </template>

        </v-banner>
        <v-container class="my-5">
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

                    <template v-slot:item.statut="{ item }">
                        <v-chip :color="item.quantite > 0 ? 'green' : 'red'" label size="small">
                            {{ item.statut }}
                        </v-chip>
                    </template>


                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>
<script>
export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        return {}
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        search: "",

        headers: [
            { title: "Libellé", align: "start", key: 'libelle' },
            { title: "Code", key: "code" },
            { title: "Prix d'achat", key: "buying_price" },
            { title: "Image", key: "image" },
            { title: "Fournisseurs", key: "fournisseur" },
            { title: "Catégories", key: "categorie" },
            { title: "Quantité", key: "quantite" },
            { title: "statut", key: "statut" },
        ],
        produits: [],


    }),

    watch: {

    },
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            this.produits = [
                {
                    id: 1,
                    libelle: "ICE Milano and ice L",
                    code: "ABZ",
                    buying_price: 5000,
                    fournisseur: "Awa",
                    categorie: "Lait",
                    image: "https://cdn.pixabay.com/photo/2016/06/14/04/51/bag-1455765_1280.jpg",
                    quantite: 2,
                    statut: "En stock"
                },
                {
                    id: 2,
                    libelle: "ADA",
                    code: "ABZ",
                    buying_price: 5000,
                    fournisseur: "Awa",
                    categorie: "Lait",
                    image: "https://cdn.pixabay.com/photo/2018/10/16/23/48/milkshake-3752840_1280.png",
                    quantite: 1,
                    statut: "En stock"
                },
                {
                    id: 3,
                    libelle: "PAWPAW",
                    code: "ABZ",
                    buying_price: 7000,
                    fournisseur: "Softcare",
                    categorie: "Crème",
                    image: null,
                    quantite: 0,
                    statut: "En rupture"
                },

            ]
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