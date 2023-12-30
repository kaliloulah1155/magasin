<template>
    <div class="dashboard ma-4">
        <NuxtPage title="Categorie" />
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Catégories</h1>
            </template>
            <template v-slot:actions>
                <popup-categorie @saveItem="getItem" />
            </template>
        </v-banner>
        <v-container class="my-5">

            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des catégories
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher une catégorie" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="categories"
                    :loading="categorieLength > 0 ? false : true" :sort-by="[{ key: 'libelle', order: 'asc' }]"
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
                                        <v-text-field label="Libellé" color="primary" clearable variant="outlined"
                                            v-model="editedItem.libelle" :rules="inputRules"></v-text-field>
                                        <v-select label="Parent" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.parent" :items="parents" item-title="libelle"
                                            item-value="id"></v-select>

                                        <v-text-field label="Position" class="mt-2" type="number" color="primary" clearable
                                            variant="outlined" v-model="editedItem.position"></v-text-field>
                                        <v-select label="statut" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.statut" :items="item_statut" item-title="state"
                                            item-value="abbr" return-object></v-select>
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
                    <template v-slot:item.statut="{ item }">

                        <template v-if="item.statut == 1">
                            <v-chip color="green" text="Activée" class="text-uppercase" label size="small">
                            </v-chip>
                        </template>
                        <template v-if="item.statut == 0">
                            <v-chip color="red" text="Desactivée" class="text-uppercase" label size="small">
                            </v-chip>
                        </template>
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

import { useCategorieStore } from '../../stores/categorie'
import { useAuthStore } from '../../stores/auth'


export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        const categorieStore = useCategorieStore()
        const authStore = useAuthStore()

        return { categorieStore, authStore }
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        snackbar: false,
        msg: '',
        err: false,
        search: "",
        url: useRuntimeConfig().public.apiBase,
        headers: [
            {
                title: "Libellé",
                align: "start",
                sortable: true,
                key: 'libelle'
            },
            { title: "Parent", key: "parent" },
            { title: "Position", key: "position" },
            { title: "Statut", key: "statut" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        inputRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        parents: [
            { libelle: 'Veuillez selectionner', id: null },
        ],
        categories: [],
        editedIndex: -1,
        statut: { state: 'Activée', abbr: 1 },
        item_statut: [
            { state: 'Activée', abbr: 1 },
            { state: 'Désactivée', abbr: 0 },

        ],
        editedItem: {
            id: 0,
            libelle: '',
            parent: '',
            code: '',
            position: 0,
            statut: 1,
        },
        defaultItem: {
            id: 0,
            libelle: '',
            parent: '',
            code: '',
            position: 0,
            statut: 1,
        }
    }),

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        'categorieStore.data'(newData, oldData) {

            if (newData.length > 0) {
                const extractedData = newData.map(({ id, libelle }) => ({ id, libelle }));

                this.parents = [...this.parents, ...extractedData];
            }
        }
    },
    mounted() {
        this.initialize()
    },
    methods: {
        async initialize() {
            if (this.authStore.data.token) {

                const response = await useNuxtApp().$axios.get(`${this.url}/categories_slug/POD`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.authStore.data.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.categories = response.data.data;
                    this.categorieStore.data = response.data.data;
                }
            } else {
                this.afficherCnx();
                
            }
        },
        afficherCnx(){
             this.msg = "Connectez - vous! ou réessayez la connexion";
            this.err = true;
            this.snackbar = true;
        },
        afficherMsg(messg){
             this.msg = messg;
            this.err = false;
            this.snackbar = true;
            this.initialize()
        },
        editItem(item) {
            this.editedIndex = this.categories.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.categories.indexOf(item)
            this.editedIndex = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
           // this.categories.splice(this.editedIndex, 1)
            this.$nextTick(() => {
                //console.log("this.editedIndex conf : ", this.editedIndex.id);

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
        async updateData(json) {
            if (this.authStore.data.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/categories/${json.id}`, json, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.authStore.data.token}`,
                    }
                });
                if (response.status == 200) {
                     this.afficherMsg("Mise à jour effectué avec succès")
                     
                };

            } else {
                this.afficherCnx();
            }
        },
           async deleteData(id) {
            if (this.authStore.data.token) {
                const response = await useNuxtApp().$axios.delete(`${this.url}/categories/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.authStore.data.token}`,
                    }
                });
                 
                if (response.status == 201) {

                    this.afficherMsg("Suppression effectuée avec succès")
                  
                };

            } else {
                this.afficherCnx();
            }
        },
        save() {

            if (this.editedIndex > -1) {
                if (
                    this.editedItem.statut &&
                    this.editedItem.statut.hasOwnProperty('state')
                ) {
                    let updatedObject = {
                        ...this.editedItem,
                        statut: this.editedItem.statut.abbr
                    }
                    //Traitement de la mise à jour en base 
                    this.updateData(updatedObject);
                } else {
                    this.updateData(this.editedItem);
                }
            }

            this.close()
        },
        getItem(fromPopup) {

            if (
                fromPopup.statut &&
                fromPopup.statut.hasOwnProperty('state') &&
                fromPopup.parent &&
                fromPopup.parent.hasOwnProperty('libelle')
            ) {
                let updatedItem = {
                    ...fromPopup,
                    statut: fromPopup.statut.abbr,
                    parent: fromPopup.parent.libelle
                }
                this.categories.push(updatedItem)
            }

        },
        closeDelete() {
            this.dialogDelete = false
        },
    },
    computed: {
        categorieLength() {
            return this.categories.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouvelle catégorie" : "Modifier une catégorie"
        }
    }
}
</script>
<style scoped></style>