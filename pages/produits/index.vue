<template>
    <div class="dashboard ma-4">
        <NuxtPage title="Employés" />
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Produits</h1>
            </template>
            <template v-slot:actions>
                 <popup-produit @saveItem="getItem" /> 
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des produits
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un produit" single-line flat hide-details variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="produits"
                    :loading="produitLength > 0 ? false : true" :sort-by="[{ key: 'libelle', order: 'asc' }]"
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
                                        <v-text-field label="Code" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.code"></v-text-field>
                                        <v-text-field label="Prix d'achat" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.buying_price"
                                            :rules="digitRules"></v-text-field>
                                         <v-text-field label="Prix de vente" class="mt-2" color="primary" clearable
                                                variant="outlined" v-model="editedItem.selling_price"
                                                :rules="digitRules"></v-text-field>
                                             <v-select label="Fournisseur" class="mt-2" color="primary" variant="outlined"
                                                    v-model="editedItem.fournisseur" :items="fournisseurs" item-title="libelle"
                                                    item-value="id" return-object></v-select>
                                             <v-select label="Catégorie" class="mt-2" color="primary" variant="outlined"
                                                v-model="editedItem.categorie" :items="categories" item-title="libelle"
                                                item-value="id" return-object></v-select>
                                        <v-file-input label="Image" v-model="image" accept="image/*" show-size counter
                                            variant="outlined"></v-file-input>
                                        <v-text-field label="Quantité" class="mt-2" color="primary" clearable
                                                variant="outlined" v-model="editedItem.quantite"
                                                :rules="digitRules"></v-text-field>
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
                    <template v-slot:item.image="{ item }">
                        <v-card class="my-2" elevation="2" rounded>
                            <v-img :src="item.image ? `${item.image}` : '/img/product.png'" height="64" cover></v-img>
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
        image: null,
        headers: [
            { title: "Libellé", align: "start", key: 'libelle' },
            { title: "Code", key: "code" },
            { title: "Prix d'achat", key: "buying_price" },
            { title: "Prix de vente", key: "selling_price" },
            { title: "Image", key: "image" },
            { title: "Fournisseurs", key: "fournisseur" },
            { title: "Catégories", key: "categorie" },
            { title: "Quantité", key: "quantite" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        inputRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        digitRules: [
            v => (v && /^\d+$/.test(v) ) || 'Entrez des chiffres',
        ],
        categories: [
            { libelle: "Lait", id: 1 },
            { libelle: 'Crème', id: 2 },
            { libelle: 'Lotion', id: 3 },
        ],
        fournisseurs: [
            { libelle: "Awa", id: 1 },
            { libelle: 'Moye', id: 2 },
            { libelle: 'Autre', id: 3 },
        ],
        produits: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            libelle: "",
            code: "",
            buying_price: 0,
            selling_price: 0,
            fournisseur: "",
            categorie: "",
            image: null,
            quantite: 0

        },
        defaultItem: {
            id: 0,
            libelle: "",
            code: "",
            buying_price: 0,
            selling_price: 0,
            fournisseur: "",
            categorie: "",
            image: null,
            quantite: 0
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
            this.produits = [
                {
                    id: 1,
                    libelle: "ICE Milano and ice L",
                    code: "ABZ",
                    buying_price: 5000,
                    selling_price: 5100,
                     fournisseur: "Awa",
                    categorie: "Lait",
                    image: "https://cdn.pixabay.com/photo/2016/06/14/04/51/bag-1455765_1280.jpg",
                    quantite: 2,
                },
                {
                    id: 2,
                   libelle: "ADA",
                    code: "ABZ",
                    buying_price: 5000,
                    selling_price: 5100,
                    fournisseur: "Awa",
                    categorie: "Lait",
                    image: "https://cdn.pixabay.com/photo/2018/10/16/23/48/milkshake-3752840_1280.png",
                    quantite: 1,
                },
                {
                    id: 3,
                    libelle: "PAWPAW",
                    code: "ABZ",
                    buying_price: 7000,
                    selling_price: 6100,
                    fournisseur: "Softcare",
                    categorie: "Crème",
                    image: null,
                    quantite: 3,
                },

            ]
        },
        editItem(item) {
            this.editedIndex = this.produits.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedItem = this.produits.indexOf(item)
            this.editedIndex = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.produits.splice(this.editedIndex, 1)
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
                console.log(" this.editedItem : ", this.editedItem)
                if (
                    this.editedItem.fournisseur &&
                    this.editedItem.fournisseur.hasOwnProperty('libelle') &&
                    this.editedItem.categorie &&
                     this.editedItem.categorie.hasOwnProperty('libelle') 
                ) {
                    let updatedObject = {
                        ...this.editedItem,
                        fournisseur: this.editedItem.fournisseur.libelle,
                        categorie: this.editedItem.categorie.libelle
                    }
                    Object.assign(this.produits[this.editedIndex], updatedObject)
                    // console.log('The key "state" exists in this.editedItem.statut.');
                } else {
                    Object.assign(this.produits[this.editedIndex], this.editedItem)
                    //console.log('The key "state" does not exist in this.editedItem.statut.');
                }
            }
            this.close()
        },
        getItem(fromPopup) {

            if (
                fromPopup.fournisseur &&
                fromPopup.fournisseur.hasOwnProperty('libelle') &&
                fromPopup.categorie &&
                fromPopup.categorie.hasOwnProperty('libelle')
            ) {
                let updatedItem = {
                    ...fromPopup,
                     fournisseur: fromPopup.fournisseur.libelle,
                    categorie: fromPopup.categorie.libelle
                }
                this.produits.push(updatedItem)
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
        produitLength() {
            return this.produits.length;
        },
        formTitle() {
            return this.editedIndex === -1 ? "Nouveau produit" : "Modifier un produit"
        }
    }
}
</script>
<style scoped></style>