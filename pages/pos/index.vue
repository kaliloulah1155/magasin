<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Point of sales</h1>
        <v-container>

            <!-- RECHERCHE PAR CATEGORIE-->
            <v-item-group mandatory>
                <v-container>
                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <v-btn size="x-small" icon="autorenew" color="green"
                                title="Rafraichissement de la liste des produits" @click="refraichir"></v-btn>
                        </v-col>
                    </v-row>
                    <v-row>

                        <v-col v-for="cat in categories" :key="cat.id" cols="12" md="4">

                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card :color="isSelected ? 'rgba(249, 232, 232, 0.8)' : ''"
                                    class="d-flex align-center" dark height="30" @click="toggle">
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
                                placeholder="Rechercher un produit" prepend-inner-icon="magnify"
                                style="max-width: 300px;" variant="solo"></v-text-field>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="{ items }">
                        <v-container class="pa-2" fluid>
                            <v-row dense>
                                <v-col v-for="item in items" :key="item.libelle" sm="6" md="5" lg="2" xl="2" xs="2">
                                    <v-tooltip :text="item.raw.libelle" activator="parent" location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-card class="pb-3" @click.prevent="addProduct(item.raw.id)" v-bind="props"
                                                border flat>
                                                <v-img :src="item.raw.image" height="100" cover></v-img>
                                                <v-list-item class="mb-2 text-center"
                                                    :subtitle="`${item.raw.selling_price}`">
                                                    <template v-slot:title>
                                                        <strong class="text-h6 mb-2 ">{{ item.raw.libelle }}</strong>
                                                    </template>
                                                </v-list-item>
                                                <div class="d-flex justify-content-center">
                                                    <div
                                                        class="d-flex align-items-center text-caption text-medium-emphasis ">
                                                        <div class="text-truncate ml-8">
                                                            <v-badge :color="item.raw.quantite > 0 ? 'info' : 'error'"
                                                                :content="Number(item.raw.quantite)" inline></v-badge>
                                                            &nbsp;
                                                            <v-chip :color="item.raw.quantite > 0 ? 'green' : 'red'">{{
                                                                item.raw.stock }}</v-chip>
                                                        </div>
                                                    </div>
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
                            <v-btn :disabled="page === 1" icon="arrow_back" density="comfortable" variant="tonal"
                                rounded @click="prevPage"></v-btn>

                            <div class="mx-2 text-caption">
                                Page {{ page }} sur {{ pageCount }}
                            </div>

                            <v-btn :disabled="page >= pageCount" icon="arrow_forward" density="comfortable"
                                variant="tonal" rounded @click="nextPage"></v-btn>
                        </div>
                    </template>
                </v-data-iterator>
            </v-card>
            <!-- END::ALL PRODUCT-->

            <!--BEGIN RIGHT SIDEBAR-->
            <v-navigation-drawer permanent app color="white" location="right" width="500">
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
                        <v-badge bordered overlap color="error" :content="qte_total">
                            <v-icon size="x-large">shopping_cart</v-icon>
                        </v-badge>
                    </div>
                </v-list>
                <v-divider class="mb-2"></v-divider>
                <!--Begin::Articles-->
                <v-row v-for="article in articles" :key="article.id">
                    <v-col sm="6" md="4" lg="3" xl="2">
                        <v-img :src="article.image" max-height="50" max-width="50" contain
                            class="mt-1 mr-1 px-1"></v-img>
                    </v-col>
                    <v-col sm="6" md="4" lg="3" xl="2">
                        <h6 class="ml-n6 text-grey text-dark text-subtitle-2 font-weight-bold">{{ article.name }}
                            <br />
                            <v-btn class="ml-2 mt-1" color="red" size="small" @click="delCartItem(article.id)"
                                variant="flat" density="compact" icon="cancel"></v-btn>
                        </h6>
                    </v-col>
                    <v-col sm="12" md="4" lg="6" xl="8">
                        <v-btn class="ml-n6" color="green" size="small" @click="incCart(article.id)" variant="flat"
                            density="compact" icon="add"></v-btn>
                        <v-divider vertical inset class="mr-1 mt-2"></v-divider> {{ article.quantity }} <v-divider
                            vertical inset class="mr-1"></v-divider>
                        <v-btn class="mx-1" color="red" size="small" @click="decCart(article.id)" variant="flat"
                            density="compact" icon="remove"></v-btn>
                        <strong class="ml-1 mr-1">{{ moneyFormat(article.price * article.quantity) }} F CFA</strong>
                    </v-col>
                    <v-divider></v-divider>
                </v-row>
                <!--END::Articles-->
                <v-row>
                    <v-col class="ma-1">
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                TOTAL
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                {{ moneyFormat(grand_total) }} F CFA
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">

                                <span>TVA(%)</span>
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" v-model="vtva" class="" style="width:10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                REMISE(F CFA)
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" v-model="vremise" class="" style="width: 10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                ESPECE(F CFA)
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" v-model="vespece" class="" style="width: 10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                MONNAIE(F CFA)
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-text-field type="number" disabled v-model="vmonnaie" class="" style="width: 10rem;" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                CLIENT
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-autocomplete v-model="editedItem.client" color="primary" variant="outlined" clearable
                                    :items="clients" item-title="fullname" item-value="id" return-object
                                    style="width:10rem;"></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                MOYEN DE PAIEMENT
                            </v-col>
                            <v-col sm="12" md="4" lg="6" xl="8">
                                <v-select v-model="editedItem.moyen_p" color="primary" variant="outlined"
                                    :items="moyen_payments" item-title="libelle" item-value="id" return-object
                                    style="width:10rem;"></v-select>
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
import { usePosStore } from '../../stores/pos'


export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        const { token } = useAuth();
        const router = useRouter();
        const posStore = usePosStore();
        return { token, router, posStore }
    },
    data: () => ({
        snackbar: false,
        msg: '',
        err: false,
        url: useRuntimeConfig().public.apiBase,
        qte_total: 0,
        grand_total: 0,
        vtva: 0,
        vremise: 0,
        vespece:0,
        vmonnaie:0,
        grand_total_init: 0,
        editedItem: {
            id: 0,
            client: "",
            moyen_p: "",
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
            { fullname: 'Veuillez selectionner', id: null },
        ],
        moyen_payments: [
            { libelle: 'Veuillez selectionner', id: null },
        ],
        categories: [],
        produits: [],
        copy_produits: [],
    }),
    watch: {
        copy_produits(val, old) {
            this.produits = val;
        },
        vtva(val, old) {
            let wtva = 0;

            if (val !== undefined && val !== null && val !== '') {
                wtva = parseInt(val);
            }
            this.grand_total = this.calculerMontantTotal(this.grand_total, this.vremise, wtva, this.grand_total_init);
            this.calculMonnaie(this.vespece);
        },
        vremise(val, old) {
            let wremise = 0;

            if (val !== undefined && val !== null && val !== '') {
                wremise = parseInt(val);
            }
            this.grand_total = this.calculerMontantTotal(this.grand_total, wremise, this.vtva, this.grand_total_init);

            this.calculMonnaie(this.vespece);
        },
        vespece(val,old){
                let wespece = 0;
                if (val !== undefined && val !== null && val !== '') {
                    wespece = parseInt(val);
                }
                this.vmonnaie=wespece - this.grand_total; //calcul de la monnaie
        }

    },
    created() {
        this.initialize()
        this.lcategorie()
        this.lproduit()
        this.lclients()
        this.lmoyenpaid()
        this.cartContent()
    },
    methods: {
        initialize() {
            this.articles = []
        },
        async lclients() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/clients`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    let reponses = response.data.data;
                    const clientsInfo = reponses.map(client => {
                        return {
                            id: client.id,
                            fullname: client.fullname
                        };
                    });
                    this.clients = clientsInfo;

                    // this.produitStore.data = response.data.data;
                }
            } else {
                this.afficherCnx();
            }
        },

        async lmoyenpaid() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/categories_slug/MDP`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    let reponses = response.data.data;
                    const moyensInfo = reponses.map(moyen => {
                        return {
                            id: moyen.id,
                            libelle: moyen.libelle
                        };
                    });
                    this.moyen_payments = moyensInfo;

                    // this.produitStore.data = response.data.data;
                }
            } else {
                this.afficherCnx();
            }
        },
        async lcategorie() {
            if (this.token) {

                const response = await useNuxtApp().$axios.get(`${this.url}/pos_categories`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.data.data.length > 0) {
                    this.categories = response.data.data;
                }
            } else {
                this.afficherCnx();

            }
        },
        refraichir() {
            this.lproduit();
        },
        async lproduit() {
            if (this.token) {

                const response = await useNuxtApp().$axios.get(`${this.url}/produits_stock`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.data.data.length > 0) {
                    this.produits = response.data.data;
                    this.posStore.produits = response.data.data;
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
            //this.initialize()
        },
        addCustomer() {
            this.router.push({ path: "/customers" });

        },
        calculMonnaie(wespece){
                 wespece = 0;
                if (wespece !== undefined && wespece !== null && wespece !== '') {
                    if(this.vespece>0){
                        wespece=this.vespece;
                    }else{
                        wespece = parseInt(wespece);
                    }
                   
                }
                this.vmonnaie=wespece - this.grand_total;
                 
        },
        calculerMontantTotal(total, remise, tva, total_init) {


            // Initialiser le total final à zéro
            let total_final = 0;

            // Vérifier si la remise est vide et la mettre à zéro si c'est le cas
            if (remise === '' || remise === undefined || isNaN(parseInt(remise))) {
                remise = 0;
            }
            // Vérifier si la TVA est vide et la mettre à zéro si c'est le cas
            if (tva === '' || tva === undefined || isNaN(parseInt(tva))) {
                tva = 0;
            }
            // Si ni la TVA ni la remise n'existent pas, retourner le total initial
            if (tva === 0 && remise === 0) {
                return total_init;
            }
            let montant_tva = 0;
            montant_tva = (total_init * parseInt(tva)) / 100;
            total_final = parseInt(total_init) + parseInt(montant_tva) - parseInt(remise)
            return parseInt(total_final);
        },
        async cartContent() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/cart`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (Object.values(response.data.cartItems).length > 0) {
                    this.articles = Object.values(response.data.cartItems);
                    this.qte_total = response.data.cartTotalQuantity;
                    this.grand_total_init = response.data.total
                    this.grand_total = this.calculerMontantTotal(parseInt(response.data.total), this.vremise, this.tva, this.grand_total_init);

                }


            } else {
                this.afficherCnx();
            }
        },
        async addProduct(id) {

            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/cart/${parseInt(id)}`, null, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                this.afficherMsg(response.data.message);
                this.cartContent();

            } else {
                this.afficherCnx();
            }
        },
        async decCart(id) {
            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/cart/${parseInt(id)}/decrease`, null, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                this.afficherMsg(response.data.message);
                this.cartContent();

            } else {
                this.afficherCnx();
            }
        },
        async delCartItem(id) {
            if (this.token) {
                const response = await useNuxtApp().$axios.delete(`${this.url}/cart/${parseInt(id)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                this.afficherMsg(response.data.message);
                this.cartContent();

            } else {
                this.afficherCnx();
            }
        },
        async incCart(id) {
            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/cart/${parseInt(id)}/increase`, null, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                this.afficherMsg(response.data.message);
                this.cartContent();

            } else {
                this.afficherCnx();
            }
        },
        printTicket() {
            console.log('print ticket')
        },
        async getCategorie(n) {

            if (this.token) {

                const response = await useNuxtApp().$axios.get(`${this.url}/pos_produit_by_categorie/${parseInt(n)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.data.data.length > 0) {
                    this.copy_produits = response.data.data;
                }
            } else {
                this.afficherCnx();

            }
        }

    }


}
</script>
<style>
.v-card.borderme {
    border: 2px solid #704232 !important;
}
</style>