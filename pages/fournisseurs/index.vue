<template>
    <div class="dashboard ma-4">

        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Fournisseur</h1>
            </template>
            <template v-slot:actions>
                <popup-fournisseur @saveItem="getItem" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des fournisseurs
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un fournisseur" single-line flat hide-details
                        variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="fournisseurs"
                    :loading="fournisseurLength > 0 ? false : true" :sort-by="[{ key: 'fullname', order: 'asc' }]"
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
                                        <v-text-field label="Fournisseur" color="primary" clearable variant="outlined"
                                            v-model="editedItem.fullname" :rules="inputRules"></v-text-field>
                                        <v-text-field label="E-mail" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.email"
                                            :rules="emailRules"></v-text-field>
                                        <v-text-field label="Adresse" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.adresse"
                                            :rules="inputRules"></v-text-field>
                                        <v-text-field label="Téléphone" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.telephone"
                                            :rules="telephoneRules"></v-text-field>
                                        <v-text-field label="Magasin" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.shopname"
                                            :rules="inputRules"></v-text-field>

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
</template>
<script>
export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        return {}
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        search: "",
        headers: [
            { title: "Fournisseurs", align: "start", key: 'fullname' },
            { title: "E-mail", key: "email" },
            { title: "Adresse", key: "adresse" },
            { title: "Telephone", key: "telephone" },
            { title: "Magasin", key: "shopname" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        inputRules: [
            v => (v && v.length >= 2) || "La longueur minimale est de 2 caractères"
        ],
        telephoneRules: [
            v => (v && /^\d+$/.test(v) && v.length === 10) || 'Entrez un nombre valide de 10 chiffres',
        ],
        emailRules: [
            v => (v && /.+@.+\..+/.test(v)) || 'Entrer une adresse e-mail valide',
        ],
        fournisseurs: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            fullname: "",
            email: "",
            adresse: "",
            telephone: "",
            shopname: "",
        },
        defaultItem: {
            id: 0,
            fullname: "",
            email: "",
            adresse: "",
            telephone: "",
            shopname: "",
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
    },
    methods: {
        initialize() {
            this.fournisseurs = [
                {
                    id: 1,
                    fullname: "AXA",
                    email: "axa@gmail.com",
                    adresse: "Plateau",
                    telephone: "0173832778",
                    shopname: "SHOP 1",
                },
                {
                    id: 2,
                    fullname: "CICI",
                    email: "cici@gmail.com",
                    adresse: "Plateau",
                    telephone: "0173832778",
                    shopname: "SHOP 2",
                },
                {
                    id: 3,
                    fullname: "SA SODECI",
                    email: "sodeci@gmail.com",
                    adresse: "Plateau",
                    telephone: "0173832778",
                    shopname: "SHOP 3",
                },

            ]
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
            this.fournisseurs.splice(this.editedIndex, 1)
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

                Object.assign(this.fournisseurs[this.editedIndex], this.editedItem)

            }
            this.close()
        },
        getItem(fromPopup) {
            this.fournisseurs.push(fromPopup)
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
        fournisseurLength() {
            return this.fournisseurs.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouveau fournisseur" : "Modifier un fournisseur"
        }
    }
}
</script>
<style scoped></style>