<template>
    <div class="dashboard ma-4">
        <NuxtPage title="Employés" />
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Employés</h1>
            </template>
            <template v-slot:actions>
                <popup-employe @saveItem="getItem" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des employés
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un employé" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="employes"
                    :loading="employeLength > 0 ? false : true" :sort-by="[{ key: 'fullname', order: 'asc' }]"
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
                                        <v-text-field label="Nom complet" color="primary" clearable variant="outlined"
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
                                        <v-file-input label="Photo" v-model="photo" accept="image/*" show-size counter
                                            variant="outlined"></v-file-input>
                                        <v-select label="Profil" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.profil" :items="profils" item-title="libelle"
                                            item-value="code" return-object></v-select>
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
                    <template v-slot:item.photo="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="item.photo ? `${item.photo}` : '/img/profil.png'" height="64" cover></v-img>
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
        photo: null,
        headers: [
            { title: "Nom complet", align: "start", key: 'fullname' },
            { title: "E-mail", key: "email" },
            { title: "Adresse", key: "adresse" },
            { title: "Telephone", key: "telephone" },
            { title: "Photo", key: "photo" },
            { title: "Profil", key: "profil" },
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
        profils: [
            { libelle: 'Caissier', code: "CSS" },
            { libelle: 'Admin', code: "ADM" },
            { libelle: 'Designer', code: "DSG" },
        ],
        employes: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            fullname: "",
            email: "",
            adresse: "",
            telephone: "",
            photo: null,
            profil: "",
        },
        defaultItem: {
            id: 0,
            fullname: "",
            email: "",
            adresse: "",
            telephone: "",
            photo: null,
            profil: "",
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
            this.employes = [
                {
                    id: 1,
                    fullname: "KONATE Ibrahima",
                    email: "ibson@gmail.com",
                    adresse: "Yop",
                    telephone: "0173832778",
                    photo: "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png",
                    profil: "Admin",
                },
                {
                    id: 2,
                    fullname: "Afisu Youssouf",
                    email: "afisu@gmail.com",
                    adresse: "Abobo",
                    telephone: "0174862778",
                    photo: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_1280.png",
                    profil: "Graphiste",
                },
                {
                    id: 3,
                    fullname: "Kone Awa",
                    email: "awakon@gmail.com",
                    adresse: "Treichville",
                    telephone: "0173062978",
                    photo: null,
                    profil: "Caissier(e)",
                },

            ]
        },
        editItem(item) {
            this.editedIndex = this.employes.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.employes.indexOf(item)
            this.editedIndex = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.employes.splice(this.editedIndex, 1)
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
                if (
                    this.editedItem.profil &&
                    this.editedItem.profil.hasOwnProperty('libelle')
                ) {
                    let updatedObject = {
                        ...this.editedItem,
                        profil: this.editedItem.profil.libelle
                    }
                    Object.assign(this.employes[this.editedIndex], updatedObject)
                    // console.log('The key "state" exists in this.editedItem.statut.');
                } else {
                    Object.assign(this.employes[this.editedIndex], this.editedItem)
                    //console.log('The key "state" does not exist in this.editedItem.statut.');
                }
            }
            this.close()
        },
        getItem(fromPopup) {

            if (
                fromPopup.profil &&
                fromPopup.profil.hasOwnProperty('libelle')
            ) {
                let updatedItem = {
                    ...fromPopup,
                    profil: fromPopup.profil.libelle
                }
                this.employes.push(updatedItem)

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
        employeLength() {
            return this.employes.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouvel employé(e)" : "Modifier un(e) employé(e)"
        }
    }
}
</script>
<style scoped></style>