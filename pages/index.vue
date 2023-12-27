<!-- LA PAGE LOGIN -->
<template>
    <div>

        <Head>
            <Title>Login</Title>
            <Meta name="description" content="Création de compte utilisateur" />
        </Head>
        <v-container>

            <v-row class="text-center d-flex justify-center">
                <v-col cols="12" sm="10">
                    <v-card class="elevation-6 mt-10">
                        <v-window v-model="step" direction="vertical">
                            <v-window-item :value="1">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-card-text class="mt-12">
                                            <h4 class="text-center">Connectez-vous à votre compte</h4>
                                            <h6 class="text-center text-grey">Connectez-vous à votre compte pour continuer à
                                                construire
                                                <br>et modifier vos flux d'accueil
                                            </h6>
                                            <v-row class="text-center d-flex justify-center">
                                                <v-col cols="12" sm="8">
                                                    <v-text-field label="Email" v-model="credentials.login" outlined
                                                        autofocus dense color="blue" autocomplete="false" class="mt-16"
                                                        prepend-inner-icon="email"
                                                        placeholder="Entrer votre email"></v-text-field>
                                                    <v-text-field v-model="credentials.password"
                                                        :append-inner-icon="visible ? 'visibility_off' : 'visibility'"
                                                        :type="visible ? 'text' : 'password'" label="Mot de passe " outlined
                                                        dense color="blue" autocomplete="false"
                                                        placeholder="Entrer votre mot de passe" prepend-inner-icon="lock"
                                                        @click:append-inner="visible = !visible"></v-text-field>
                                                    <v-row>
                                                        <v-col cols="12" sm="8">
                                                            <span class="caption text-blue">Mot de passe oublié ?</span>
                                                        </v-col>
                                                    </v-row>
                                                    <div class="mt-2">
                                                        <v-btn to="/dashboard" color="blue" dark block tile
                                                            @click.prevent="login">Valider</v-btn>
                                                    </div>
                                                    <div
                                                        class="d-flex justify-space-between align-center mx-10 mb-16 mt-10">
                                                        <v-row align="center" justify="center">
                                                            <v-col cols="auto">
                                                                <v-btn href="https://web.facebook.com/kewoustore2/"
                                                                    target="_blank" title="Visiter notre page facebook"
                                                                    icon="facebook" variant="outlined" color="blue"
                                                                    size="large">
                                                                </v-btn>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-col>
                                    <v-col cols="12" md="6" class="blue rounded-bl-xl">
                                        <div style="text-align:center;padding:180px 0;">
                                            <v-card-text class="text-white">
                                                <h3 class="text-center">Vous n'avez pas de compte ?</h3>
                                                <h6>Nous allons vous préparer pour que vous puissiez créer votre première
                                                    expérience utilisateur.
                                                </h6>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn color="blue-darken-4" outlined dark
                                                    @click="step++">S'INSCRIRE</v-btn>
                                            </div>
                                        </div>

                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <v-window-item :value="2">
                                <v-row>
                                    <v-col cols="12" sm="6" class="blue rounded-br-xl">
                                        <div style="text-align:center;padding:180px 0;">
                                            <v-card-text class="text-white">
                                                <h3 class="text-center ">Votre compte existe déjà ? </h3>
                                                <h6 class="text-center">Veuillez créer votre compte</h6>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn color="blue-darken-4" outlined dark @click="step--">SE
                                                    CONNECTER</v-btn>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-card-text class="mt-12">
                                            <h4 class="text-center"> Créer votre compte </h4>
                                            <h6>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quasi sit
                                                consequatur voluptatibus, consequuntur.</h6>
                                            <v-row align="center" justify="center">
                                                <v-col cols="12" sm="10">
                                                    <v-text-field label="Nom" placeholder="Veuillez renseigner votre nom"
                                                        outlined dense color="blue" autocomplete="false"
                                                        class="mt-2"></v-text-field>
                                                    <v-text-field label="Prénoms"
                                                        placeholder="Veuillez renseigner votre prénoms" outlined dense
                                                        color="blue" autocomplete="false"></v-text-field>
                                                    <v-text-field label="E-mail"
                                                        placeholder="Veuillez renseigner votre email" outlined dense
                                                        color="blue" autocomplete="false"></v-text-field>
                                                    <v-text-field
                                                        :append-inner-icon="svisible ? 'visibility_off' : 'visibility'"
                                                        :type="svisible ? 'text' : 'password'" label="Mot de passe "
                                                        outlined dense color="blue" autocomplete="false"
                                                        placeholder="Entrer votre mot de passe" prepend-inner-icon="lock"
                                                        @click:append-inner="svisible = !svisible"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="8" style="margin-left: 6rem;margin-bottom:2rem">
                                                    <div>

                                                        <v-btn color="blue" dark block tile>Valider</v-btn>
                                                    </div>

                                                </v-col>
                                            </v-row>
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
     <v-snackbar
          v-model="snackbar"
          multi-line
          location="top"
          color="red-lighten-3"
        >
          {{ error_msg }}

          <template v-slot:actions>
            <v-btn
              color="white"
              variant="text"
              @click="snackbar = false"
            >
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
        async login() {
             const { signIn, status } = useAuth();
             const authStatus = status.value;
            try {
               
                await signIn(
                    { ...this.credentials },
                    { callbackUrl: '/dashboard' } // Where the user will be redirected after a successiful login
                )
            } catch (error) {

                this.error_msg=  "Une erreur est survenue. Veuillez réessayer !"
                this.snackbar=true
              
                console.log("error", error);
                console.log("status : ", authStatus);
            }
        }

    }
}
</script>

<style scoped>
.rounded-bl-xl {
    border-bottom-left-radius: 300px !important;
    background-color: rgb(109, 109, 247);
}

.rounded-br-xl {
    border-bottom-right-radius: 300px !important;
    background-color: rgb(109, 109, 247);
}
</style>