<template> 
    <nav>
        <v-navigation-drawer app v-model="drawer" location="left"  color="blue-darken-4">
            <v-col class="text-center">
                <v-img src="logo.png" alt="Logo Entreprise" ></v-img>
            </v-col>
            <v-col>
                <v-list>
                    <v-divider :thickness="7" color="success"></v-divider>
                    <v-list-item :prepend-avatar="photo" 
                    :title="`${nom} ${prenoms}`" :subtitle="profil"
                    @click="openDialogImg(photo)" class="clickable-image"
                    >
                    </v-list-item>
                    <v-divider :thickness="7" color="success"></v-divider>
                </v-list>   
            </v-col>
            <!-- BEGIN: Afficage des menus sidebar-->
            <nav class="ma-2">
                <v-list>
                    <v-list-item v-for="link in links" :key="link.resourceId" router :to="link.resourcePath" color="green"
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
                    <v-btn @click.prevent="logout" color="red-darken-4" block flat elevation="10">
                        D&Eacute;CONNEXION
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar class="border rounded px-3" max-height="300">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" color="black"></v-app-bar-nav-icon>

            <v-app-bar-title>
                <h3>GLOBAL PLUS : Votre application de gestion de stock et des inventaires</h3>
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <template v-slot:append>
                
            </template>
            
        </v-app-bar>
        <v-dialog v-model="dialogImg" max-width="600">
      <v-card>
        <v-img :src="selectedImage ?  selectedImage : '/img/profil.png'" aspect-ratio="16/9"></v-img>
      </v-card>
    </v-dialog>
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

const dialogImg=ref(false);
const selectedImage=ref(null);

const links =ref([]);

onMounted(() => {
 authStore.data=data.value;
});
links.value= removeDuplicates(authStore.data.menus,'resourceName');


 

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

const openDialogImg=(image)=>{
            selectedImage.value = image;
            dialogImg.value = true;
        }
</script>