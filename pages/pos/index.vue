<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Point of sales</h1>
        <v-container class="my-5">
            <!-- BEGIN:: ALL PRODUCT-->
            <v-card flat>
                <v-data-iterator :items="games" :items-per-page="6" :search="search">
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
                                <v-col v-for="item in items" :key="item.title" cols="auto" md="4">
                                    <v-card class="pb-3" border flat>
                                        <v-img :src="item.raw.img" height="200" cover></v-img>

                                        <v-list-item class="mb-2" :subtitle="item.raw.subtitle">
                                            <template v-slot:title>
                                                <strong class="text-h6 mb-2">{{ item.raw.title }}</strong>
                                            </template>
                                        </v-list-item>

                                        <div class="d-flex justify-space-between px-4">
                                            <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                                                <v-icon icon="clock" start></v-icon>

                                                <div class="text-truncate">{{ item.raw.duration }}</div>
                                            </div>

                                            <v-btn border flat size="small" class="text-none" text="Read">
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
                                Page {{ page }} of {{ pageCount }}
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
                                TVA
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                18 %
                            </v-col>
                        </v-row>
                         <v-row>
                                <v-col sm="12" md="4" lg="6" xl="8">
                                    REMISE
                                </v-col>
                                <v-col sm="12" md="4" lg="6" xl="8">
                                    2 %
                                </v-col>
                            </v-row>
                             <v-row>
                                <v-col sm="12" md="4" lg="6" xl="8">
                                    CLIENT
                                </v-col>
                                <v-col sm="12" md="4" lg="6" xl="8">
                                    AGL
                                </v-col>
                            </v-row>
                              <v-row>
                                    <v-col sm="12" md="4" lg="6" xl="8">
                                        MOYEN DE PAIEMENT
                                    </v-col>
                                    <v-col sm="12" md="4" lg="6" xl="8">
                                        ESPECE
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
        games: [
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png',
                title: 'The Sci-Fi Shooter Experience',
                subtitle: 'Dive into a futuristic world of intense battles and alien encounters.',
                advanced: false,
                duration: '8 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/2.png',
                title: 'Epic Adventures in Open Worlds',
                subtitle: 'Embark on a journey through vast, immersive landscapes and quests.',
                advanced: true,
                duration: '10 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/3.png',
                title: 'Surviving the Space Station Horror',
                subtitle: 'Navigate a haunted space station in this chilling survival horror game.',
                advanced: false,
                duration: '9 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/5.png',
                title: 'Neon-Lit High-Speed Racing Thrills',
                subtitle: 'Experience adrenaline-pumping races in a futuristic, neon-soaked city.',
                advanced: true,
                duration: '12 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/6.png',
                title: 'Retro-Style Platformer Adventures',
                subtitle: 'Jump and dash through pixelated worlds in this classic-style platformer.',
                advanced: false,
                duration: '11 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/7.png',
                title: 'Medieval Strategic War Campaigns',
                subtitle: 'Lead armies into epic battles and conquer kingdoms in this strategic game.',
                advanced: true,
                duration: '10 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/1.png',
                title: 'Underwater VR Exploration Adventure',
                subtitle: 'Dive deep into the ocean and discover the mysteries of the underwater world.',
                advanced: true,
                duration: '11 minutes',
            },
            {
                img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/8.png',
                title: '1920s Mystery Detective Chronicles',
                subtitle: 'Solve crimes and uncover secrets in the glamourous 1920s era.',
                advanced: false,
                duration: '9 minutes',
            },
            {
                img: '/img/bread.jpg',
                title: 'Pain de miche',
                subtitle: 'Solve crimes and uncover secrets in the glamourous 1920s era.',
                advanced: false,
                duration: '9 minutes',
            },
            {
                img: '/img/croissant.jpg',
                title: 'Croissant',
                subtitle: 'Solve crimes and uncover secrets in the glamourous 1920s era.',
                advanced: false,
                duration: '9 minutes',
            },
            {
                img: '/img/jaune_doeuf.jpg',
                title: "Jaune d'oeuf",
                subtitle: 'Solve crimes and uncover secrets in the glamourous 1920s era.',
                advanced: false,
                duration: '9 minutes',
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