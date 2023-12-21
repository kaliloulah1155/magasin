<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Point of sales</h1>
        <v-container class="my-5">

            <!-- RECHERCHE PAR CATEGORIE-->
            <v-item-group mandatory>
                <v-container>
                    <v-row>
                        <v-col v-for="n in 6" :key="n" cols="12" md="4">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center" dark height="50"
                                    @click="toggle">
                                    <v-scroll-y-transition>
                                        <div class="text-subtitle-1 flex-grow-1 text-center">
                                            {{ isSelected ? 'Selected' : 'Click Me!' }}
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
                <v-data-iterator :items="produits" :items-per-page="6" :search="search">
                    <template v-slot:header>
                        <v-toolbar class="px-2">
                            <v-text-field v-model="search" clearable density="comfortable" hide-details
                                placeholder="Recherche" prepend-inner-icon="magnify" style="max-width: 300px;"
                                variant="solo"></v-text-field>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="{ items }">
                        <v-container class="pa-2" fluid>
                            <v-row dense>
                                <v-col v-for="item in items" :key="item.libelle" sm="6" md="4" lg="3" xl="2" xs="2"  >
                                    <v-card class="pb-3" border flat  >
                                        <v-img :src="item.raw.image" height="200" cover></v-img>

                                        <v-list-item class="mb-2 text-center" :subtitle="`${item.raw.selling_price} F CFA`">
                                            <template v-slot:title>
                                                <strong class="text-h6 mb-2 ">{{ item.raw.libelle }}</strong>
                                            </template>
                                        </v-list-item>

                                        <div class="d-flex justify-space-between px-4">
                                            <div class="d-flex align-center text-caption text-medium-emphasis me-1">

                                                <div class="text-truncate">
                                                    <v-badge :color="item.raw.quantite > 0 ? 'info' : 'error'"
                                                        :content="item.raw.quantite" inline></v-badge>
                                                    &nbsp;
                                                    <v-chip :color="item.raw.quantite > 0 ? 'green' : 'red'">{{
                                                        item.raw.statut }}</v-chip>

                                                </div>
                                            </div>

                                            <v-btn border flat size="small" class="text-none" icon="add">
                                            </v-btn>
                                        </div>
                                    </v-card>
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
                                <v-combobox color="primary" variant="outlined" clearable :items="clients"
                                    item-title="fullname" item-value="id" return-object style="width:10rem;"></v-combobox>
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
        produits: [
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png',
                libelle: "Lait",
                selling_price: 2000,
                quantite: 2,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/2.png',
                libelle: "Bonbon",
                selling_price: 1000,
                quantite: 0,
                statut: 'En rupture',
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/3.png',
                libelle: "Pomme",
                selling_price: 2300,
                quantite: 1,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/5.png',
                libelle: "Ananas",
                selling_price: 600,
                quantite: 5,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/6.png',
                libelle: "Prume",
                selling_price: 780,
                quantite: 2,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/7.png',
                libelle: "Mangue",
                selling_price: 850,
                quantite: 3,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/1.png',
                libelle: "Palme",
                selling_price: 4120,
                quantite: true,
                statut: "En stock",
            },
            {
                image: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/8.png',
                libelle: "Oignon",
                selling_price: 1250,
                quantite: 2,
                statut: "En stock",
            },
            {
                image: '/img/bread.jpg',
                libelle: 'Pain de miche',
                selling_price: 200,
                quantite: 1,
                statut: "En stock",
            },
            {
                image: '/img/croissant.jpg',
                libelle: 'Croissant',
                selling_price: 1200,
                quantite: 4,
                statut: "En stock",
            },
            {
                image: '/img/jaune_doeuf.jpg',
                libelle: "Jaune d'oeuf",
                selling_price: 570,
                quantite: 3,
                statut: "En stock",
            },
        ],
    }),
    created() {
        this.initialize()
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
        addCustomer() {
            alert('add client')
        },
        printTicket() {
            alert('print ticket')
        }

    }

}
</script>
<style>
.v-card.borderme {
    border: 2px solid #704232 !important;
}
</style>