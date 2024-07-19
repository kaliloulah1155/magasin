<template>
    <nav>
        <v-navigation-drawer app v-model="drawer" location="left" color="rgba(249, 232, 232, 0.8)">
            <v-col class="text-center">
                <v-img src="logo.png" alt="Logo Entreprise"></v-img>
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
                    <v-list-item v-for="link in links" :key="link.resourceId" router :to="link.resourcePath" color="primary"
                        rounded="shaped">
                        <template v-slot:prepend>
                            <v-icon class="dark caption"   >{{ link.resourceIcon }}</v-icon>
                        </template>
                        <v-list-item-title>{{ link.resourceName }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </nav>
            <!-- END: Afficage des menus sidebar-->
            
            <!-- Bouton de deconnexion  -->
            <template v-slot:append>
                <div class="pa-2">
                    <v-btn @click.prevent="logout" color="rgba(243, 105, 127, 0.8)" block flat elevation="10">
                        D&Eacute;CONNEXION
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar class="border rounded px-3" max-height="300">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" color="black"></v-app-bar-nav-icon>

            <v-app-bar-title>
                <marquee behavior="" direction=""><b>GLOBAL SHOP PLUS :</b> Votre application de gestion de stock</marquee>
            </v-app-bar-title>

            <v-spacer></v-spacer>

        </v-app-bar>
    </nav>
</template>

<script setup>
import { ref ,onMounted,watch} from 'vue'
import { useAuthStore } from '../stores/auth'

const { signOut,data} = useAuth();

const authStore = useAuthStore();
const { removeDuplicates } = useRemoveDuplicates();

const nom =ref(data.value.nom)
const prenoms = ref(data.value.prenoms)
const profil =ref(data.value.profile_name)
const photo = ref(data.value.image)

const links =ref([]);

onMounted(() => {
 authStore.data=data.value;
});
links.value= removeDuplicates(authStore.data.menus,'resourceName');
console.log("links : ",removeDuplicates(links.value,'resourceName'));

 

watch(() => authStore.data, (newValue, oldValue) => {
 
  //links.value=newValue.menus
  links.value= removeDuplicates(newValue.menus,'resourceName');
}, { deep: true });
 

const drawer = ref(null)
 

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