<template>
    <div class="dashboard ma-4">
        <NuxtPage title="Employés" />
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Produits</h1>
            </template>
            <template v-slot:actions>
                <popup-produit @saveItem="getItem" :list_cats="categories" :fournisseurs="fournisseurs" />
            </template>
        </v-banner>
        <v-container class="my-5">
            <v-card flat>
                <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="view_list"></v-icon>&nbsp;
                    Liste des produits
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" prepend-inner-icon="search" density="compact"
                        label="Rechercher un produit" single-line flat hide-details
                        variant="solo-filled"></v-text-field>
                </v-card-title>
                <v-divider class="mt-5"></v-divider>
                <v-data-table v-model:search="search" :headers="headers" :items="produits"
                    :loading="produitLength > 0 ? false : true" :sort-by="[{ key: 'libelle', order: 'asc' }]"
                    items-per-page="10">

                    <template v-slot:item.categories="{ item }">
                        <template v-for="(cat, index) in item.categories">
                            {{ cat }}
                            <span v-if="index !== item.categories.length - 1">, </span>
                        </template>
                    </template>

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
                                        <v-text-field label="Prix d'achat" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.buying_price"
                                            :rules="digitRules"></v-text-field>
                                        <v-text-field label="Prix de vente" class="mt-2" color="primary" clearable
                                            variant="outlined" v-model="editedItem.selling_price"
                                            :rules="digitRules"></v-text-field>
                                        <v-select label="Fournisseur" class="mt-2" color="primary" variant="outlined"
                                            v-model="editedItem.fournisseur" :items="fournisseurs" item-title="fullname"
                                            item-value="id" return-object></v-select>
                                        <v-combobox label="Catégories" chips multiple clearable class="mt-2"
                                            color="primary" variant="outlined" v-model="editedItem.categories"
                                            :items="categories" item-title="libelle" item-value="id"
                                            return-object></v-combobox>
                                        <v-file-input label="Image" v-model="photo" accept="image/*" show-size counter
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
import { useProduitStore } from '../../stores/produit'
export default {
    setup() {
        definePageMeta({
            layout: 'master'
        })
        const authStore = useAuthStore()
        const produitStore = useProduitStore()
        const { token } = useAuth()
       return { authStore, produitStore, token }
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        snackbar: false,
        msg: '',
        err: false,
        search: "",
        url: useRuntimeConfig().public.apiBase,
        image: null,
        headers: [
            { title: "Libellé", align: "start", key: 'libelle' },
            { title: "Code", key: "code" },
            { title: "Prix d'achat", key: "buying_price" },
            { title: "Prix de vente", key: "selling_price" },
            { title: "Image", key: "image" },
            { title: "Fournisseurs", key: "fournisseur" },
            { title: "Catégories", key: "categories" },
            { title: "Quantité", key: "quantite" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        inputRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        digitRules: [
            v => (v && /^\d+$/.test(v) ) || 'Entrez des chiffres',
        ],
        categories: [],
         fournisseurs: [
             { fullname: 'Veuillez selectionner', id: null },
         ],
        produits: [],
        photo: null,
        editedIndex: -1,
        editedItem: {
            id: 0,  
            libelle: "",
            code: "",
            buying_price: 0,
            selling_price: 0,
            fournisseur_id: null,
            fournisseur: "",
            categories: "",
            image: null,
            quantite: 0

        },
        defaultItem: {
            id: 0,
            libelle: "",
            code: "",
            buying_price: 0,
            selling_price: 0,
            fournisseur_id:null,
            fournisseur: "",
            categories: "",
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
        },
         'produitStore.data'(newData, oldData) {
             if (newData.length > 0) {
                 const extractedData = newData.map(({ id, fullname }) => ({ id, fullname }));

                 // Filtrer les éléments déjà présents dans le tableau parents
                 const filteredData = extractedData.filter(({ id }) => !this.fournisseurs.some(parent => parent.id === id));

                 // Ajouter les éléments filtrés au tableau parents
                 this.fournisseurs = [...this.fournisseurs, ...filteredData];
             }
         },
          'produitStore.cats'(newData, oldData) {
            if (newData.length > 0) {
                const extractedData = newData.map(({ id, libelle }) => ({ id, libelle }));

                // Filtrer les éléments déjà présents dans le tableau parents
                const filteredData = extractedData.filter(({ id }) => !this.categories.some(parent => parent.id === id));

                // Ajouter les éléments filtrés au tableau parents
                this.categories = [...this.categories, ...filteredData];
            }
        }
    },
    created() {
        this.initialize()
        this.fournisseurs_list()
       
    },
     mounted() {
         this.categories_list()
     },
    methods: {
        async initialize() {
            if (this.token) {
                const response = await useNuxtApp().$axios.get(`${this.url}/produits`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });

                if (response.data.data.length > 0) {
                    this.produits = response.data.data;
                    this.produitStore.data = response.data.data;
                }

            } else {
                this.afficherCnx();
            }
        },

         async categories_list() {
            if (this.token) {

                const response = await useNuxtApp().$axios.get(`${this.url}/categories_slug/POD`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${this.token}`,
                    }
                });
                if (response.data.data.length > 0) {
                    //this.categories = response.data.data;
                    this.produitStore.cats = response.data.data;
                }
            } else {
                this.afficherCnx();
                
            }
        },
         async fournisseurs_list() {
             if (this.token) {    
                 const response = await useNuxtApp().$axios.get(`${this.url}/fournisseurs`, {
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `${this.token}`,
                     }
                 });

                 if (response.data.data.length > 0) {
                     this.fournisseurs = response.data.data;
                     this.produitStore.data = response.data.data;
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
            this.editedIndex = this.produits.indexOf(item)
            // Create a copy of the item
            this.editedItem = { ...item };
            // Remove spaces and "F CFA" from the "montant" key
            this.editedItem.buying_price = parseInt(removeFCFAAndSpaces(this.editedItem.buying_price))
            this.editedItem.selling_price = parseInt(removeFCFAAndSpaces(this.editedItem.selling_price))
            // Set the dialog to true
            this.dialog = true;
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
               
                let updatedObject = { ...this.editedItem }; // Créez une copie de l'objet initial
                   if (this.editedItem.fournisseur && this.editedItem.fournisseur.hasOwnProperty('fullname')) {
                       updatedObject.fournisseur_id = this.editedItem.fournisseur.id;
                 }

                if (this.photo) {
                    updatedObject.image = this.photo;
                }

               if(updatedObject.categories[0] !== null ){
                const categoryIds = updatedObject.categories.map(updatedCategory => {
                    // Recherche de l'objet correspondant dans this.categories en fonction du libellé
                    if (updatedCategory.libelle && updatedCategory.hasOwnProperty('libelle')) {
                        updatedCategory = updatedCategory.libelle;
                 }
                    const matchedCategory = this.categories.find(category => category.libelle === updatedCategory);
                    // Récupération de l'identifiant de l'objet s'il est trouvé, sinon retourner null
                    return matchedCategory ? matchedCategory.id : null;
                });
                const uniqueCategoryIds = Array.from(new Set(categoryIds)); //retirer les doublons
                      updatedObject.categories=uniqueCategoryIds;
               }
               this.updateData(updatedObject);
            }
            this.close()
        },    
        async updateData(json) {
            if (this.token) {

                const formData = new FormData();

                // Ajoutez les champs à formData
                formData.append('id', parseInt(json.id));
                formData.append('libelle', json.libelle);
                formData.append('fournisseur_id',parseInt(json.fournisseur_id));
                formData.append('buying_price', parseInt(json.buying_price));
                formData.append('selling_price',parseInt(json.selling_price));
                // Ajoutez ici la logique pour le fichier (s'il existe)
                if (json.image) {
                    formData.append('image', json.image[0]);
                }
                formData.append('quantite', parseInt(json.quantite));

                //formData.append('categories', JSON.stringify(json.categories));
               // const idsArray = json.categories.map(category => category.id);
                formData.append('categories', JSON.stringify(json.categories));
               // formData.append('categories', json.categories);


                const response = await useNuxtApp().$axios.post(`${this.url}/produits/${json.id}`, formData, {
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
        getItem(fromPopup) {

            if (
                fromPopup.fournisseur &&
                fromPopup.fournisseur.hasOwnProperty('libelle') ||
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