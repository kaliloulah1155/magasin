<template>
    <div class="dashboard ma-4">

        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Dépenses</h1>
            </template>
            <template v-slot:actions>
                <popup-depense @saveItem="getItem" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des dépenses
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher une dépense" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="depenses"
                    :loading="depenseLength > 0 ? false : true" :sort-by="[{ key: 'detail', order: 'asc' }]"
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
                                        <v-textarea label="Détail" class="mt-2" color="primary" clearable variant="outlined"
                                            rows="1" auto-grow v-model="editedItem.description"
                                            :rules="detailRules"></v-textarea>
                                        <v-text-field label="Montant" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.montant"
                                            :rules="montantRules"></v-text-field>
                                        <v-text-field label="Date de dépense" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.date_depense"
                                            :rules="[isDateValid]"></v-text-field>
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
import { useDepenseStore } from '../../stores/depense'


export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        

        const authStore = useAuthStore()
        const depenseStore = useDepenseStore()
        const { token } = useAuth()

        return { authStore, depenseStore, token, }
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
            { title: "Détails", align: "start", key: 'description' },
            { title: "Montant", key: "montant" },
            { title: "Date de dépense", key: "date_depense" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        detailRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        montantRules: [
            v => (v && /^\d+$/.test(v)) || 'Entrez un montant',
        ],
        depenses: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            description: "",
            montant: "",
            date_depense: "",
        },
        defaultItem: {
            id: 0,
            description: "",
            montant: "",
            date_depense: "",
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
        async initialize() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/depenses`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.depenses = response.data.data;
                    this.depenseStore.data = response.data.data;
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

            this.initialize()
        },
        editItem(item) {
         
            this.editedIndex = this.depenses.indexOf(item)
            // Create a copy of the item
            this.editedItem = { ...item };
            // Remove spaces and "F CFA" from the "montant" key
            this.editedItem.montant = removeFCFAAndSpaces(this.editedItem.montant)
            // Set the dialog to true
            this.dialog = true;
        },
        async deleteData(id) {
            if (this.token) {
                const response = await useNuxtApp().$axios.delete(`${this.url}/depenses/${id}`, {
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
        deleteItem(item) {
            this.editedItem = this.depenses.indexOf(item)
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
            async createData(json) {
            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/depenses`, json, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.status == 200) {
                    this.afficherMsg("Dépense créé avec succès")
                };

            } else {
                this.afficherCnx();
            }
        },
        getItem(fromPopup) {
            let updatedItem = {
                ...fromPopup
            }
              this.createData(updatedItem);
        },
        async updateData(json) {
            if (this.token) {
                const response = await useNuxtApp().$axios.post(`${this.url}/depenses/${json.id}`, json, {
                    headers: {
                        'Content-Type': 'application/json',
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
        save() {
            if (this.editedIndex > -1) {
                let updatedObject = { ...this.editedItem }; // Créez une copie de l'objet initial
                this.updateData(updatedObject);
            }

            this.close()
        },

        isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        },
        isValidDate(day, month, year) {
            const daysInMonth = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
        },
        isDateValid(v) {
            if (!v || !/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                return 'Entrez une date valide au format DD/MM/YYYY';
            }

            const [day, month, year] = v.split('/').map(Number);

            if (!this.isValidDate(day, month, year)) {
                return 'Entrez une date valide avec le nombre correct de jours et de mois.';
            }

            return true;
        },

    },
    computed: {
        depenseLength() {
            return this.depenses.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouvelle dépense" : "Modifier une dépense"
        }
    }
}
</script>
<style scoped></style>~/composables/rmFCFAAndSpaces