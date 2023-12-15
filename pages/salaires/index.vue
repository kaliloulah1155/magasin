<template>
    <div class="dashboard ma-4">

        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Salaires</h1>
            </template>
            <template v-slot:actions>
                <popup-salaire @saveItem="getItem" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des salariés
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un salarie" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="salaires"
                    :loading="salaireLength > 0 ? false : true" :sort-by="[{ key: 'fullname', order: 'asc' }]"
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

                                        <v-select label="Nom complet" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.fullname" :items="salaries" item-title="fullname"
                                            item-value="id" return-object></v-select>
                                        <v-text-field label="Montant" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.montant"
                                            :rules="montantRules"></v-text-field>
                                        <v-text-field label="Date de paiement" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.created_at"
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
            { title: "Nom complet", align: "start", key: 'fullname' },
            { title: "Montant", key: "montant" },
            { title: "Date de paiement", key: "created_at" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        montantRules: [
            v => (v && /^\d+$/.test(v)) || 'Entrez un montant',
        ],
        salaires: [],
        salaries: [
            { fullname: "KONATE Ibrahima", id: 1 },
            { fullname: "KONE Aziz", id: 2 },

        ],
        editedIndex: -1,
        editedItem: {
            id: 0,
            fullname: "",
            montant: "",
            created_at: "",
        },
        defaultItem: {
            id: 0,
            fullname: "",
            montant: "",
            created_at: "",
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
            this.salaires = [
                {
                    id: 1,
                    fullname: "KONATE Ibrahima",
                    montant: 5000,
                    created_at: "22/12/2023",
                },
                {
                    id: 2,
                    fullname: "SYLLA Rokia",
                    montant: 7000,
                    created_at: "23/12/2023",
                },
                {
                    id: 3,
                    fullname: "SA SODECI",
                    montant: 5200,
                    created_at: "20/11/2023",
                },

            ]
        },
        editItem(item) {
            this.editedIndex = this.salaires.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.salaires.indexOf(item)
            this.editedIndex = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.salaires.splice(this.editedIndex, 1)
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
                    this.editedItem.fullname &&
                    this.editedItem.fullname.hasOwnProperty('fullname')
                ) {
                    let updatedObject = {
                        ...this.editedItem,
                        fullname: this.editedItem.fullname.fullname,
                    }
                    
                    Object.assign(this.salaires[this.editedIndex], updatedObject)
                    // console.log('The key "state" exists in this.editedItem.statut.');
                } else {
                    
                    Object.assign(this.salaires[this.editedIndex], this.editedItem)
                    //console.log('The key "state" does not exist in this.editedItem.statut.');
                }

                

            }
            this.close()
        },
        getItem(fromPopup) {
              if (
                fromPopup.fullname &&
                fromPopup.fullname.hasOwnProperty('fullname') 
            ) {
                let updatedItem = {
                    ...fromPopup,
                    fullname: fromPopup.fullname.fullname,
                }
                this.salaires.push(updatedItem)
            }
           
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
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
        salaireLength() {
            return this.salaires.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouveau salaire" : "Modifier un salaire"
        }
    }
}
</script>
<style scoped></style>