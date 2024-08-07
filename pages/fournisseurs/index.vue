<template>
    <div class="dashboard ma-4">
        <template v-if="accessRights.canView">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-grey mb-4">Fournisseurs</h1>
            </template>
            <template v-if="accessRights.canCreate" v-slot:actions>
                <popup-fournisseur @saveItem="getItem" :profils="profils" :item_statut="item_statut"
                    :sexe_statut="sexe_statut" />
            </template>
        </v-banner>
        <v-container fluid class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des fournisseurs 
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un fournisseur" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>

                <v-data-table v-model:search="search" :headers="headers" :items="fournisseurs"
                    :loading="fournisseurLength > 0 ? false : true" :sort-by="[{ key: 'fullname', order: 'asc' }]"
                    items-per-page="10">

                    <template v-slot:top>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="750">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-form class="px-3" ref="form">
                                        <v-row>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="Nom" color="primary" clearable variant="outlined"
                                            v-model="editedItem.nom" :rules="inputRules"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="Prénoms" color="primary" clearable variant="outlined"
                                            v-model="editedItem.prenoms" :rules="inputRules"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="Adresse" color="primary" clearable variant="outlined"
                                            v-model="editedItem.adresse" :rules="inputRules"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="E-mail" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.email"
                                            :rules="emailRules"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-select label="Sexe" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.lib_sexe" :items="sexe_statut" item-title="libelle"
                                            item-value="id" return-object></v-select>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field label="Téléphone" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.telephone"
                                            :rules="telephoneRules"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-file-input label="Photo" v-model="photo" accept="image/*" show-size counter
                                            variant="outlined"></v-file-input>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-select label="Profil" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.profil_id" :items="profils" item-title="libelle"
                                            item-value="id" return-object></v-select>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-select label="Statut" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.statut" :items="item_statut" item-title="libelle"
                                            item-value="id" return-object></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="elevated" size="small" @click="close">
                                        Annuler
                                    </v-btn>
                                    <v-btn color="green-darken-3" variant="elevated" size="small" @click="save">
                                        Valider
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card max-height="500px">
                                <div class="text-center mt-4">
                                    <v-icon icon="delete_forever" color="red" size="large"></v-icon>
                                </div>
                                <v-card-title class="text-h5 text-center">&Ecirc;tes-vous s&ucirc;re de supprimer
                                    ?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="elevated" size="x-small" @click="closeDelete">Annuler</v-btn>
                                    <v-btn color="red-darken-3" size="x-small" variant="elevated"
                                        @click="deleteItemConfirm">Confirmer</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>
                    <template v-slot:item.lib_active="{ item }">
                        <v-chip :color="item.lib_active === 'Activé' ? 'green' : 'red'" :value="item.lib_active"
                            class="text-uppercase" label size="small">
                            {{ item.lib_active }}
                        </v-chip>
                    </template>

                    <template v-slot:item.image="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="item.image ? `${item.image}` : '/img/profil.png'" height="64"  cover  @click="openDialogImg(item.image)" class="clickable-image" ></v-img>
                        </v-card>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon
                        v-if="accessRights.canEdit" 
                        size="small" class="me-2" @click="editItem(item)">
                            edit_note
                        </v-icon>
                        <v-icon 
                         v-if="accessRights.canDelete"
                        size="small" @click="deleteItem(item)">
                            delete
                        </v-icon>
                    </template>

                </v-data-table>
            </v-card>
        </v-container>
         </template>
    <template v-else>
      <v-sheet
        class="d-flex align-center justify-center mt-4 flex-wrap text-center mx-auto px-4"
        elevation="4"
        height="250"
        max-width="800"
        width="100%"
        rounded
      >
        <div>
          <h2 class="text-h4 font-weight-black text-orange">
            Vous n'avez pas les droits necessaires
          </h2>
        </div>
      </v-sheet>
    </template>
    </div>
    <v-snackbar v-model="snackbar" multi-line location="top" :color="err ? 'red-lighten-3' : 'green-lighten-3'">
        {{ msg }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">
                Fermer
            </v-btn>
        </template>
    </v-snackbar>
    <v-dialog v-model="dialogImg" max-width="600">
      <v-card>
        <v-img :src="selectedImage ?  selectedImage : '/img/profil.png'" aspect-ratio="16/9"></v-img>
      </v-card>
    </v-dialog>
</template>
<script>
import { useFournisseurStore } from '../../stores/fournisseur'
import { useAuthStore } from '../../stores/auth'
export default {
    setup() {
        useHead({
      title: "Fournisseurs",
    });
        definePageMeta({
            layout: 'master'
        })
        const authStore = useAuthStore()
        const fournisseurStore = useFournisseurStore()
        const { data,token } = useAuth()
        
    const accessRights = reactive({
       profil_id:data.value.profil_id,
      canCreate: false,
      canView: false,
      canEdit: false,
      canDelete: false,
    });

        return { authStore, fournisseurStore, token,accessRights }
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        dialogImg:false,
        selectedImage:null,
        snackbar: false,
        msg: '',
        err: false,
        search: "",
        url: useRuntimeConfig().public.apiBase,
        pwd: useRuntimeConfig().public.pwdForUser,
        photo: null,
        headers: [
            { title: "Nom complet", align: "start", key: 'fullname' },
            { title: "E-mail", key: "email" },
            { title: "Sexe", key: "lib_sexe" },
            { title: "Telephone", key: "telephone" },
            { title: "Statut", key: "lib_active" },
            { title: "Photo", key: "image" },
            // { title: "Profil", key: "profile_name" },
            { title: "Adresse", key: "adresse" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        inputRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        telephoneRules: [
            v => (v && /^\d+$/.test(v) && v.length === 10) || 'Entrez un nombre valide de 10 chiffres',
        ],
        emailRules: [
            v => (v && /.+@.+\..+/.test(v)) || 'Entrer une adresse e-mail valide',
        ],
        profils: [],
        fournisseurs: [],
        editedIndex: -1,
        item_statut: [
            { libelle: 'Activé', id: 1 },
            { libelle: 'Désactivé', id: 0 },
        ],
        sexe_statut: [
            { libelle: 'Homme', code: "M" },
            { libelle: 'Femme', code: "F" },
        ],
        editedItem: {
            id: 0,
            fullname: "",
            nom: "",
            prenoms: "",
            adresse: "",
            email: "",
            sexe: "",
            lib_sexe: "M",
            telephone: "",
            image: null,
            profil_id: 0,
            profil: "",
            statut: 1,
        },
        defaultItem: {
            id: 0,
            fullname: "",
            nom: "",
            prenoms: "",
            adresse: "",
            email: "",
            sexe: "M",
            lib_sexe: "M",
            telephone: "",
            image: null,
            profil_id: 0,
            profil: "",
            statut: 1,
        },
    }),

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        }
    },
    created() {
        this.initialize()
        this.profils_list()
        this.accessRights.canView=true;
    this.checkUserAccess();
    },
    methods: {
        async checkUserAccess(){
      let checkjson = {
        profil_id: this.accessRights.profil_id,
        menu_libelle: "FOURNISSEURS",
      };
      if (this.token) {
        const response = await useNuxtApp().$axios.post(
          `${this.url}/test_permission`,
          checkjson,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.token}`,
            },
          }
        );
        this.accessRights.canView = response.data[0].show;
        this.accessRights.canCreate = response.data[1].add;
        this.accessRights.canEdit = response.data[2].edit;
        this.accessRights.canDelete = response.data[4].supp;
      }
    },
        async initialize() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/fournisseurs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.fournisseurs = response.data.data;
                    this.fournisseurStore.data = response.data.data;
                }

            } else {
                this.afficherCnx();
            }
        },
        async profils_list() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/profils_e/Fournisseur`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.profils = response.data.data;

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
            this.photo = null;
            this.initialize()
        },
        editItem(item) {
            this.editedIndex = this.fournisseurs.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.fournisseurs.indexOf(item)
            this.editedIndex = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.$nextTick(() => {
                this.deleteData(this.editedIndex.id)

            })
            this.closeDelete()
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedIndex = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex > -1) {
                let updatedObject = { ...this.editedItem }; // Créez une copie de l'objet initial

                if (this.editedItem.profil_id && this.editedItem.profil_id.hasOwnProperty('libelle')) {
                    updatedObject.profil_id = this.editedItem.profil_id.id;
                }

                if (this.editedItem.statut && this.editedItem.statut.hasOwnProperty('libelle')) {
                    updatedObject.statut = this.editedItem.statut.id;
                }

                if (this.editedItem.lib_sexe && this.editedItem.lib_sexe.hasOwnProperty('libelle')) {
                    updatedObject.sexe = this.editedItem.lib_sexe.code;
                }
                if (this.photo) {
                    updatedObject.image = this.photo;
                }

                this.updateData(updatedObject);
            }

            this.close()
        },
        async createData(json) {
            const formData = new FormData();
            // Ajoutez les champs à formData
            formData.append('nom', json.nom);
            formData.append('prenoms', json.prenoms);
            formData.append('adresse', json.adresse);
            formData.append('email', json.email);
            formData.append('telephone', json.telephone);
            formData.append('sexe', json.sexe);
            // Ajoutez ici la logique pour le fichier (s'il existe)
            if (json.image) {
                formData.append('image', json.image[0]);
            }
            formData.append('isActive', json.statut);
            formData.append('profil_id', json.profil_id);
            formData.append('password', this.pwd);
            formData.append('password_confirmation', this.pwd);

            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.status == 200) {
                    this.afficherMsg("Fournisseur créé avec succès")
                };

            } else {
                this.afficherCnx();
            }
        },
        async deleteData(id) {
            if (this.token) {
                const response = await useNuxtApp().$axios.delete(`${this.url}/users/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.status == 201) {
                    this.afficherMsg("Suppression effectuée avec succès")
                };

            } else {
                this.afficherCnx();
            }
        },
        getItem(fromPopup) {
            let savedObject = { ...fromPopup };
            if (fromPopup.profil_id && fromPopup.profil_id.hasOwnProperty('libelle')) {
                savedObject.profil_id = fromPopup.profil_id.id;
            }

            if (fromPopup.statut && fromPopup.statut.hasOwnProperty('libelle')) {
                savedObject.statut = fromPopup.statut.id;
            }
            if (fromPopup.sexe && fromPopup.sexe.hasOwnProperty('libelle')) {
                savedObject.sexe = fromPopup.sexe.code;
            }

            this.createData(savedObject);
        },
        async updateData(json) {
            if (this.token) {

                const formData = new FormData();

                // Ajoutez les champs à formData
                formData.append('id', json.id);
                formData.append('nom', json.nom);
                formData.append('prenoms', json.prenoms);
                formData.append('adresse', json.adresse);
                formData.append('email', json.email);
                formData.append('telephone', json.telephone);
                formData.append('sexe', json.sexe);
                // Ajoutez ici la logique pour le fichier (s'il existe)
                if (json.image) {
                    formData.append('image', json.image[0]);
                }
                formData.append('isActive', json.statut);
                formData.append('profil_id', json.profil_id);


                const response = await useNuxtApp().$axios.post(`${this.url}/users/${json.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.status == 200) {

                    this.afficherMsg("Mise à jour effectué avec succès")
                };

            } else {
                this.afficherCnx();
            }
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        openDialogImg(image){
            this.selectedImage = image;
            this.dialogImg = true;
        }
    },
    computed: {
        fournisseurLength() {
            return this.fournisseurs.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouveau fournisseur" : "Modifier un fournisseur"
        }
    }
}
</script>
<style scoped>

</style>