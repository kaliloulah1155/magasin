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
                                            <h4 class="text-center">Connectez-vous à votre compte</h4>
                                            <v-row class="text-center d-flex justify-center">
                                                <v-col cols="12" sm="10">
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
                                                    
                                                    <div class="">
                                                        <NuxtLink to="" class="">
                                                            Mot de passe oublié ?
                                                        </NuxtLink>
                                                    </div>

                                                    <div class="mt-2">
                                                        <v-btn to="/dashboard" color="blue" dark block tile
                                                            @click.prevent="login">Se connecter</v-btn>
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
                                                    @click="step++">EN SAVOIR PLUS</v-btn>
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
                                                <h6 class="text-center">Veuillez vous connecter à votre compte</h6>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn color="blue-darken-4" outlined dark @click="step--">SE
                                                    CONNECTER</v-btn>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-card-text class="mt-12">
                                            
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
    background-color: rgb(109, 109, 247);
}

.rounded-br-xl {
    border-bottom-right-radius: 300px !important;
    background-color: rgb(109, 109, 247);
}
</style>