<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Point of sales</h1>
        <v-container>

            <!-- RECHERCHE PAR CATEGORIE-->
            <v-item-group mandatory>
                <v-container>
                    <v-row>
                        <v-col v-for="cat in categories" :key="cat.id" cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card :color="isSelected ? 'rgba(249, 232, 232, 0.8)' : ''" class="d-flex align-center"
                                    dark height="30" @click="toggle">
                                    <v-scroll-y-transition>
                                        <div class="text-subtitle-1 flex-grow-1 text-center"
                                            @click.prevent="getCategorie(cat.id)">

                                            {{ cat.libelle }}
                                        </div>
                                    </v-scroll-y-transition>
                                </v-card>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-container>
            </v-item-group>
            <!-- END RECHERCHE PAR CATEGORIE-->
            <!-- BEGIN:: ALL PRODUCT-->
            <v-card flat>
                <v-data-iterator :items="produits" :items-per-page="13" :search="search">
                    <template v-slot:header>
                        <v-toolbar class="px-2">
                            <v-text-field v-model="search" clearable density="comfortable" hide-details
                                placeholder="Rechercher un produit" prepend-inner-icon="magnify" style="max-width: 300px;"
                                variant="solo"></v-text-field>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="{ items }">
                        <v-container class="pa-2" fluid>
                            <v-row dense>
                                <v-col v-for="item in items" :key="item.libelle" sm="6" md="5" lg="2" xl="2" xs="2">
                                    <v-tooltip :text="item.raw.libelle" activator="parent" location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-card class="pb-3" v-bind="props" border flat>
                                                <v-img :src="item.raw.image" height="100" cover></v-img>
                                                <v-list-item class="mb-2 text-center"
                                                    :subtitle="`${item.raw.selling_price} F CFA`">
                                                    <template v-slot:title>
                                                        <strong class="text-h6 mb-2 ">{{ item.raw.libelle }}</strong>
                                                    </template>
                                                </v-list-item>
                                                <div class="d-flex justify-space-between ">
                                                    <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                                                        <div class="text-truncate">
                                                            <v-badge :color="item.raw.quantite > 0 ? 'info' : 'error'"
                                                                :content="Number(item.raw.quantite)" inline> </v-badge>
                                                            &nbsp;
                                                            <v-chip :color="item.raw.quantite > 0 ? 'green' : 'red'">{{
                                                                item.raw.statut }}</v-chip>
                                                        </div>
                                                    </div>
                                                    <v-btn border flat size="small" class="text-none mx-1"
                                                        icon="add"></v-btn>

                                                </div>
                                            </v-card>
                                        </template>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>

                    <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                        <div class="d-flex align-center justify-center pa-4">
                            <v-btn :disabled="page === 1" icon="arrow_back" density="comfortable" variant="tonal" rounded
                                @click="prevPage"></v-btn>

                            <div class="mx-2 text-caption">
                                Page {{ page }} sur {{ pageCount }}
                            </div>

                            <v-btn :disabled="page >= pageCount" icon="arrow_forward" density="comfortable" variant="tonal"
                                rounded @click="nextPage"></v-btn>
                        </div>
                    </template>
                </v-data-iterator>
            </v-card>
            <!-- END::ALL PRODUCT-->
            <!--BEGIN RIGHT SIDEBAR-->
            <v-navigation-drawer permanent app color="white" location="right" width="400">
                <v-list subheader lines="two" class="mt-5">
                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <v-card class="mx-auto" @click="addCustomer" max-width="344" hover>
                                <v-card-item class="d-flex justify-center">
                                    <v-card-title>
                                        <v-icon>co_present</v-icon>
                                    </v-card-title>
                                </v-card-item>
                                <v-card-text class="d-flex justify-center">
                                    Ajouter un client
                                </v-card-text>
                            </v-card>
                        </v-col>
                          <v-dialog v-model="dialog_client" max-width="300px">
                                    <v-card title="Ajouter un nouveau client" >
                                        <v-card-text>
                                            <v-form class="px-3" ref="form">
                                                <v-text-field label="Nom complet" color="primary" clearable variant="outlined"
                                                    v-model="editedItem.fullname" :rules="inputRules"></v-text-field>
                                                <v-text-field label="E-mail" class="mt-2" color="primary" clearable
                                                    variant="outlined" v-model="editedItem.email"
                                                    :rules="emailRules"></v-text-field>
                                                <v-text-field label="Adresse" class="mt-2" color="primary" clearable
                                                    variant="outlined" v-model="editedItem.adresse"
                                                    :rules="inputRules"></v-text-field>
                                                <v-text-field label="Téléphone" class="mt-2" color="primary" clearable
                                                    variant="outlined" v-model="editedItem.telephone"
                                                    :rules="telephoneRules"></v-text-field>
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn text="FERMER" variant="elevated" @click="dialog_client = false"
                                                size="small"></v-btn>
                                            <v-btn color="green-darken-3" variant="elevated" size="small">Valider</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                        <v-col cols="auto">
                            <v-card class="mx-auto" @click="printTicket" max-width="344" hover>
                                <v-card-item class="d-flex justify-center">
                                    <v-card-title>
                                        <v-icon>print</v-icon>
                                    </v-card-title>
                                </v-card-item>
                                <v-card-text class="d-flex justify-center">
                                    Imprimer Ticket
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <div class="d-flex justify-center mt-6">
                        <v-badge bordered overlap color="error" content="10">
                            <v-icon size="x-large">shopping_cart</v-icon>
                        </v-badge>
                    </div>
                </v-list>
                <v-divider class="mb-2"></v-divider>
                <!--Begin::Articles-->
                <v-row v-for="article in articles" :key="article.id">
                    <v-col sm="6" md="4" lg="3" xl="2">
                        <v-img :src="article.image" max-height="50" max-width="50" contain class="mt-1 mr-1 px-1"></v-img>
                    </v-col>
                    <v-col sm="6" md="4" lg="3" xl="2">
                        <h6 class="ml-n6 text-grey text-dark text-subtitle-2 font-weight-bold">{{ article.libelle }}
                            <br />
                            <v-btn class="ml-2 mt-1" color="red" size="small" variant="flat" density="compact"
                                icon="cancel"></v-btn>
                        </h6>
                    </v-col>
                    <v-col sm="12" md="4" lg="6" xl="8">
                        <v-btn class="ml-n6" color="green" size="small" variant="flat" density="compact" icon="add"></v-btn>
                        <v-divider vertical inset class="mr-1 mt-2"></v-divider> {{ article.quantite }} <v-divider vertical
                            inset class="mr-1"></v-divider>
                        <v-btn class="mx-1" color="red" size="small" variant="flat" density="compact" icon="remove"></v-btn>
                        <strong class="ml-1 mr-1">{{ article.price }} F CFA</strong>
                    </v-col>
                    <v-divider></v-divider>
                </v-row>
                <!--END::Articles-->
                <v-row>
                    <v-col class="ma-1">
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <span>TVA(%)</span>
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" class="" style="width:10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                REMISE(F CFA)
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" class="" style="width: 10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                CLIENT
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-autocomplete color="primary" variant="outlined" clearable :items="clients"
                                    item-title="fullname" item-value="id" return-object
                                    style="width:10rem;"></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                MOYEN DE PAIEMENT
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-select color="primary" variant="outlined" :items="moyen_payments" item-title="libelle"
                                    item-value="id" return-object style="width:10rem;"></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                TOTAL
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                1 500 500 F CFA
                            </v-col>
                        </v-row>

                        <v-toolbar color="rgba(0,0,0,0)" flat class="d-flex justify-center">
                            <v-btn size="x-large" block variant="flat" color="green" density="compact"
                                elevation="1">COMMANDER</v-btn>
                        </v-toolbar>
                    </v-col>
                </v-row>

            </v-navigation-drawer>
            <!--END::RIGHT SIDEBAR-->

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
        dialog_client: false,
        url: useRuntimeConfig().public.apiBase,
        editedItem: {
            id: 0,
            fullname: "",
            email: "",
            adresse: "",
            telephone: "",
            photo: null,
        },
        inputRules: [
            (v) => (v && v.length >= 3) || "La longueur minimale est de 3 caractères",
        ],
        telephoneRules: [
            v => (v && /^\d+$/.test(v) && v.length === 10) || 'Entrez un nombre valide de 10 chiffres',
        ],
        emailRules: [
            v => (v && /.+@.+\..+/.test(v)) || 'Entrer une adresse e-mail valide',
        ],
        search: '',
        articles: [],
        clients: [
            { fullname: "KONATE Ibrahima", id: 1 },
            { fullname: "KONE Issouf", id: 2 },
            { fullname: "KOUYATE Idriss", id: 3 },
        ],
        moyen_payments: [
            { libelle: "ESPECE", id: 1 },
            { libelle: "CHEQUE", id: 2 },
            { libelle: "CREDIT", id: 3 },
            { libelle: "MOBILE MONEY", id: 3 },
        ],
        categories: [
            { libelle: "Categorie 1", id: 1 },
            { libelle: "Categorie 2", id: 2 },
            { libelle: "Categorie 3", id: 3 },
            { libelle: "Categorie 4", id: 4 },
        ],
        produits: [
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png',
                libelle: "Lait",
                selling_price: 2000,
                quantite: 2,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/2.png',
                libelle: "Bonbon",
                selling_price: 1000,
                quantite: 0,
                statut: 'Rupture',
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/3.png',
                libelle: "Pomme",
                selling_price: 2300,
                quantite: 1,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/5.png',
                libelle: "Ananas",
                selling_price: 600,
                quantite: 5,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/6.png',
                libelle: "Prume",
                selling_price: 780,
                quantite: 2,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/7.png',
                libelle: "Mangue",
                selling_price: 850,
                quantite: 3,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/1.png',
                libelle: "Palme",
                selling_price: 4120,
                quantite: true,
                statut: "Stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/8.png',
                libelle: "Oignon",
                selling_price: 1250,
                quantite: 2,
                statut: "Stock",
            },
            {
                image: '/img/bread.jpg',
                libelle: 'Pain de miche',
                selling_price: 200,
                quantite: 1,
                statut: "Stock",
            },
            {
                image: '/img/croissant.jpg',
                libelle: 'Croissant',
                selling_price: 1200,
                quantite: 4,
                statut: "Stock",
            },
            {
                image: '/img/jaune_doeuf.jpg',
                libelle: "Jaune d'oeuf",
                selling_price: 570,
                quantite: 3,
                statut: "Stock",
            },
        ],
    }),
    created() {
        this.initialize()
        this.consommer()
    },
    methods: {
        initialize() {
            this.articles = [
                {
                    id: 1,
                    libelle: "Lait",
                    quantite: 2,
                    price: 200,
                    image: "/img/bread.jpg"
                },
                {
                    id: 2,
                    libelle: "Croissant",
                    quantite: 1,
                    price: 200,
                    image: "/img/croissant.jpg"
                },
                {
                    id: 2,
                    libelle: "Prod 303",
                    quantite: 1,
                    price: 320,
                    image: "/img/product.png"
                },
                {
                    id: 3,
                    libelle: "Jaune d'oeuf ",
                    quantite: 1,
                    price: 420,
                    image: "/img/jaune_doeuf.jpg"
                },


            ]
        },
        consommer() {
           /* const res = useNuxtApp().$axios.get(`${this.url}/todos/1`)
            res.then(({ data }) => {
                console.log(data)
            })*/
        },
        addCustomer() {
            console.log('add client')
            this.dialog_client = true
        },
        printTicket() {
            console.log('print ticket')
        },
        getCategorie(n) {
            console.log(n)
        }

    }

}
</script>
<style>
.v-card.borderme {
    border: 2px solid #704232 !important;
}
</style>