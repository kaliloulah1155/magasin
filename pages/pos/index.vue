<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Point of sales</h1>
        <v-container class="my-5">
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
                                <v-card class="mx-auto"  @click="printTicket" max-width="344" hover>
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
                <v-container>

                    <!--Begin::Article 1-->
                    <v-row v-for="article in articles" :key="article.id">
                        <v-col cols="12" sm="3">
                            <v-img :src="article.image" max-height="50" max-width="50" contain class="mt-1 mr-1"></v-img>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <h6 class="ml-n6 text-grey text-dark text-subtitle-2 font-weight-bold"> {{ article.libelle }}
                                <br />
                                <v-btn class="ml-2 mt-1" color="red" size="small" variant="flat" density="compact"
                                    icon="cancel"></v-btn>
                            </h6>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-btn class="ml-n6" color="green" size="small" variant="flat" density="compact"
                                icon="add"></v-btn>
                            <v-divider vertical inset class="mr-1 mt-2"></v-divider> {{ article.quantite }} <v-divider
                                vertical inset class="mr-1"></v-divider>
                            <v-btn class="mx-1" color="red" size="small" variant="flat" density="compact"
                                icon="remove"></v-btn>
                            <strong class="ml-1 mr-1">{{ article.price }} F CFA</strong>

                        </v-col>
                    </v-row>
                    <!--END::Article 1-->

                </v-container>
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
        articles: [],
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
                    image: "/img/product.jpg"
                }
            ]
        },
        addCustomer(){
            alert('add client')
        },
        printTicket(){
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