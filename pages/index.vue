<!-- LA PAGE LOGIN -->
<template>
    <div>

        <Head>
            <Title>Connexion | GlobalShop plus</Title>
            <Meta name="description" content="Création de compte utilisateur" />
        </Head>
        <v-container>
            <v-row class="text-center d-flex justify-center">
                <v-col cols="12" sm="10">
                    <v-card class="elevation-6 mt-4">
                        <v-window v-model="step" direction="vertical">
                            <v-window-item :value="1">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-card-text class="mt-12">
                                            <h2 class="text-center">Connectez-vous à votre compte</h2>
                                            <v-row class="text-center d-flex justify-center">
                                                <v-col cols="12" sm="10">
                                                    <v-text-field label="Email" v-model="credentials.login" outlined
                                                        autofocus dense color="blue" autocomplete="false" class="mt-16"
                                                        prepend-inner-icon="email"
                                                        placeholder="Entrer votre email"></v-text-field>
                                                    <v-text-field v-model="credentials.password"
                                                        :append-inner-icon="visible ? 'visibility_off' : 'visibility'"
                                                        :type="visible ? 'text' : 'password'" label="Mot de passe "
                                                        outlined dense color="blue" autocomplete="false"
                                                        placeholder="Entrer votre mot de passe"
                                                        prepend-inner-icon="lock"
                                                        @click:append-inner="visible = !visible"></v-text-field>



                                                    <div class="mt-2">
                                                        <v-btn :loading="loading" @click="load" to="/dashboard"
                                                            color="blue-darken-4" dark block tile
                                                            @click.prevent="login">Se connecter</v-btn>
                                                    </div>
                                                    <br>
                                                    <div class="mt-4">
                                                        <v-btn to="" color="blue-darken-2" variant="outlined">Mot de
                                                            passe oublié ?

                                                            <v-dialog activator="parent" max-width="500">
                                                                <template v-slot:default="{ isActive }">
                                                                    <v-card rounded="lg">
                                                                    <v-card-title class="d-flex justify-space-between align-center">
                                                                        <div class="text-h5 text-medium-emphasis ps-2">
                                                                            Réinitialisation de mot de passe
                                                                        </div>

                                                                        <v-btn
                                                                        icon="mdi-close"
                                                                        color="blue-darken-4"
                                                                        variant="text"
                                                                        @click="isActive.value = false"
                                                                        ></v-btn>
                                                                    </v-card-title>

                                                                    <v-divider class="mb-4"></v-divider>

                                                                    <v-card-text>
                                                                        <div class="text-medium-emphasis mb-4">
                                                                        Veuillez entrez votre mot de passe et vous allez recevoir un code de reilitialisation.
                                                                        </div>

                                                                        <div class="mb-2">Entrez votre adresse email</div>

                                                                        <v-text-field label="Email" v-model="credentials.login" outlined
                                                                            autofocus dense color="blue" autocomplete="false"
                                                                            prepend-inner-icon="email"
                                                                            placeholder="Entrer votre email">
                                                                        </v-text-field>
                                                                    </v-card-text>

                                                                    <v-divider class="mt-2"></v-divider>

                                                                    <v-card-actions class="my-2 d-flex justify-end">
                                                                        <v-btn
                                                                        class="text-none"
                                                                        rounded="xl"
                                                                        text="Annuler"
                                                                        @click="isActive.value = false"
                                                                        ></v-btn>

                                                                        <v-btn
                                                                        class="text-none"
                                                                        color="blue-darken-4"
                                                                        rounded="xl"
                                                                        text="Envoyer"
                                                                        variant="flat"
                                                                        @click="isActive.value = false"
                                                                        ></v-btn>
                                                                    </v-card-actions>
                                                                    </v-card>
                                                                </template>
                                                            </v-dialog>
                                                        </v-btn>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-col>
                                    <v-col cols="12" md="6" class="blue rounded-bl-xl">
                                        <div style="text-align:center;padding:180px 0;">
                                            <v-card-text class="text-white">
                                                <h1 class="text-center ">Gérez mieux la caisse !</h1>
                                                <br>
                                                <h3 class="text-center">Décrouvrez les meilleurs fonctionnalités que
                                                    offrent
                                                    <b>GLOBAL PLUS</b>
                                                </h3>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn color="blue-darken-4" outlined dark @click="step++">EN SAVOIR
                                                    PLUS</v-btn>
                                            </div>
                                        </div>

                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <v-window-item :value="2">
                                <v-row>
                                    <v-col cols="12" sm="6" class="blue rounded-br-xl">
                                        <div style="padding:180px 0;">
                                            <v-card-text class="text-white">
                                                <h1 class="text-center ">Votre compte existe déjà ? </h1>
                                                <br>
                                                <h3 class="text-center">Veuillez vous connecter à votre compte</h3>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn color="blue-darken-4" outlined dark @click="step--">SE
                                                    CONNECTER</v-btn>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-card-text class="mt-12">
                                            <v-card-text>
                                                <h3 class="">Une application de point de vente (POS) performante avec
                                                    des fonctionnalités robustes pour améliorer
                                                    l'efficacité</h3>
                                                <v-container>
                                                    <ul>
                                                        <li>Gestion des Inventaires</li>
                                                        <li>Traitement des Paiements</li>
                                                        <li>Gestion des Clients</li>
                                                        <li>Analyse des performances des produits et des employés</li>
                                                        <li>Gestion des retours et des échanges</li>
                                                        <li>Gestion des commandes en ligne et des livraisons</li>
                                                        <li>Sauvegardes automatiques et sécurisées des données</li>
                                                    </ul>
                                                </v-container>
                                            </v-card-text>
                                            <h3 class="">Pour plus d'informations veuillez nous contactez !</h3>
                                            <div class="text-left mt-2">
                                                <v-chip class="ma-2" color="primary" variant="outlined">
                                                    <v-icon icon="mdi-server-plus" start></v-icon>
                                                    ibrahim1155@outlook.com
                                                </v-chip>

                                                <v-chip class="ma-2" color="success" variant="outlined">
                                                    <v-icon icon="mdi-server-plus" start></v-icon>
                                                    +225 01 73 83 27 78
                                                </v-chip>
                                            </div>
                                        </v-card-text>
                                    </v-col>
                                </v-row>

                            </v-window-item>
                        </v-window>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <v-snackbar v-model="snackbar" multi-line location="top" color="red-lighten-3">
        {{ error_msg }}

        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">
                Fermer
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script  lang="ts">
export default {
    setup() {
        definePageMeta({
            public: true,
            auth: {
                unauthenticatedOnly: true,
                navigateAuthenticatedTo: '/dashboard',
            }
        })
        return {

        }
    },
    props: {
        source: String
    },
   
    data: () => ({
        step: 1,
        loading: false,
        visible: false,
        svisible: false,
         snackbar: false,
         error_msg:'',
        credentials: {
            login: "",
            password: ""
        }
    }),
    methods: {

        load() {
            this.loading = true
            setTimeout(() => (this.loading = false), 3000)
        },
      
        async login() {
             const { signIn } = useAuth();
            try {
                   
                await signIn(
                    { ...this.credentials },
                    { callbackUrl: '/dashboard' } // Where the user will be redirected after a successiful login
                )
            } catch (error) {
                this.error_msg=  "Une erreur est survenue. Veuillez réessayer !"
                this.snackbar=true
            }
        }

    }
}
</script>

<style scoped>
.rounded-bl-xl {
    border-bottom-left-radius: 300px !important;
    background-color: rgb(69, 6, 157);
}

.rounded-br-xl {
    border-bottom-right-radius: 300px !important;
    background-color: rgb(69, 6, 157);
}
</style>