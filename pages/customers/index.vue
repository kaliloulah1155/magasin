<template>
    <div class="dashboard ma-4">
        <NuxtPage title="Clients" />
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Clients</h1>
            </template>
            <template v-slot:actions>
                <popup-client @saveItem="getItem" :profils="profils" :item_statut="item_statut"
                    :sexe_statut="sexe_statut" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des clients
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un client" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>

                <v-data-table v-model:search="search" :headers="headers" :items="clients"
                    :loading="clientLength > 0 ? false : true" :sort-by="[{ key: 'fullname', order: 'asc' }]"
                    items-per-page="10">

                    <template v-slot:top>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>

                                    <v-form class="px-3" ref="form">
                                        <v-text-field label="Nom" color="primary" clearable variant="outlined"
                                            v-model="editedItem.nom" :rules="inputRules"></v-text-field>
                                        <v-text-field label="Prénoms" color="primary" clearable variant="outlined"
                                            v-model="editedItem.prenoms" :rules="inputRules"></v-text-field>
                                            <v-text-field label="Adresse" color="primary" clearable variant="outlined"
                                                v-model="editedItem.adresse" :rules="inputRules"></v-text-field>
                                        <v-text-field label="E-mail" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.email"
                                            :rules="emailRules"></v-text-field>
                                        <v-select label="Sexe" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.lib_sexe" :items="sexe_statut" item-title="libelle"
                                            item-value="id" return-object></v-select>
                                        <v-text-field label="Téléphone" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.telephone"
                                            :rules="telephoneRules"></v-text-field>
                                        <v-file-input label="Photo" v-model="photo" accept="image/*" show-size counter
                                            variant="outlined"></v-file-input>
                                        <v-select label="Profil" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.profil_id" :items="profils" item-title="libelle"
                                            item-value="id" return-object></v-select>
                                        <v-select label="Statut" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.statut" :items="item_statut" item-title="libelle"
                                            item-value="id" return-object></v-select>
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
                            <v-img :src="item.image ? `${item.image}` : '/img/profil.png'" height="64" cover></v-img>
                        </v-card>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-icon size="small" class="me-2" @click="editItem(item)">
                            edit_note
                        </v-icon>
                        <v-icon size="small" @click="deleteItem(item)">
                            delete
                        </v-icon>
                    </template>

                </v-data-table>
            </v-card>
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
import { useClientStore } from '../../stores/client'
import { useAuthStore } from '../../stores/auth'
export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        const authStore = useAuthStore()
        const clientStore = useClientStore()
        const { token } = useAuth()
        return { authStore, clientStore, token }
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
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
        clients: [],
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
    },
    methods: {
        async initialize() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/clients`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.clients = response.data.data;
                    this.clientStore.data = response.data.data;
                }

            } else {
                this.afficherCnx();
            }
        },
        async profils_list() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/profils_e/Client`, {
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
            this.editedIndex = this.clients.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.clients.indexOf(item)
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
                    this.afficherMsg("Client créé avec succès")
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
    },
    computed: {
       clientLength() {
            return this.clients.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouveau client" : "Modifier un client"
        }
    }
}
</script>
<style scoped></style>