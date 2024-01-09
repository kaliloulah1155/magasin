<template>
    <nav>
        <v-navigation-drawer app v-model="drawer" location="left" color="rgba(249, 232, 232, 0.8)">
            <v-col class="text-center">
                <v-avatar color="grey-lighten-5 " rounded="0" size="100">
                    <v-img src="logo.png"
                        alt="Logo Entreprise"></v-img>
                </v-avatar>
                <p class="text-center font-weight-black text-caption text-uppercase text-subtitle-1 mt-1">
                    KEWOUSTORE
                </p>
            </v-col>
            <v-col>
                <v-list>
               
                    <v-list-item :prepend-avatar="photo" :title="`${nom} ${prenoms}`" :subtitle="profil">
                    </v-list-item>
                </v-list>
            </v-col>
            <!-- BEGIN: Afficage des menus sidebar-->
            <nav class="ma-2">
                <v-list>
                    <v-list-item v-for="link in links" :key="link.icon" router :to="link.route" color="primary"
                        rounded="shaped">
                        <template v-slot:prepend>
                            <v-icon class="dark caption"   >{{ link.icon }}</v-icon>
                        </template>
                        <v-list-item-title>{{ link.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </nav>
            <!-- END: Afficage des menus sidebar-->
            <!-- Bouton de deconnexion  -->
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn @click.prevent="logout" color="rgba(243, 105, 127, 0.8)" block flat size="small" elevation="1">
                        D&Eacute;CONNEXION
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar>
            
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" color="blue"></v-app-bar-nav-icon>
            <v-app-bar-title>Application</v-app-bar-title>
        </v-app-bar>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
 

const { signOut,data } = useAuth();

const nom =ref(data.value.nom)
const prenoms = ref(data.value.prenoms)
const profil =ref(data.value.profile_name)
const photo = ref(data.value.image)

 

const drawer = ref(null)
const links = ref([
    { text: "DASHBOARD", icon: "dashboard", route: "/dashboard" },
    { text: "POINT OF SALES", icon: "point_of_sale", route: "/pos" },
    { text: "EMPLOYES", icon: "group", route: "/employes" },
     { text: "CLIENTS", icon: "co_present", route: "/customers" },
    { text: "FOURNISSEURS", icon: "currency_exchange", route: "/fournisseurs" },
    { text: "CATEGORIES", icon: "collections_bookmark", route: "/categories" },
    { text: "PRODUITS", icon: "add_chart", route: "/produits" },
    { text: "DEPENSES", icon: "account_balance", route: "/depenses" },
    { text: "STOCKS", icon: "store", route: "/stocks" },
      { text: "SALAIRES", icon: "payments", route: "/salaires" }
])

const logout=async()=>{
   try {
        await signOut({
            callbackUrl: '/',
            redirect: true
        })
        // Add after logout logic here, could be removing the session data from localstorage or whatever
       
    } catch (error) {
       console.log("error", error);
    }
}
</script>