<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css" />
    <div class="dashboard ma-4">
        <v-banner lines="one" color="warning">
            <template v-slot:text>
                <h1 class="text-subtitle-1 text-grey">Catégories</h1>
            </template>
            <template v-slot:actions>
                <popup-categorie />
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
                :loading="categorieLength >0 ? false:true"
                    :sort-by="[{ key: 'libelle', order: 'asc' }]" items-per-page="10">
                      <template v-slot:item.statut="{item}">
                            <v-chip
                            :color="item.statut == 1 ? 'green':'red'"
                            :text="item.statut ==1 ? 'Activée':'Desactivée'"
                            class="text-uppercase"
                            label
                            size="small"
                            >
                            </v-chip>
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
definePageMeta({
    layout: 'master'
})
export default {
    data: () => ({
        search: "",
        headers: [
            {
                title: "Libellé",
                align: "start",
                sortable: false,
                key: 'libelle'
            },
            { title: "Parent", key: "parent" },
            { title: "Code", key: "code" },
            { title: "Position", key: "position" },
            { title: "Statut", key: "statut" },
            { title: "Actions", key: "actions", sortable: false }
        ],
        categories: []
    }),
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            this.categories = [
                {
                    libelle: "Frozen Yogurt",
                    parent: "",
                    code: "FRZ",
                    position: 2,
                    statut: 1,
                },
                {
                    libelle: 'Ice cream sandwich',
                    parent: "",
                    code: "ICE",
                    position: 2,
                    statut: 0,
                },
                {
                    libelle: 'Eclair',
                    parent: "ICE",
                    code: "ICE",
                    position: 2,
                    statut: 1,
                },

            ]
        },
        editItem(item) {
            console.log(item)
        },
        deleteItem(item) {
            console.log(item)
        }
    },
    computed:{
        categorieLength() {
            return this.categories.length;
        },
    }
}
</script>
<style scoped>
.v-pagination {
    background: rgba(12, 185, 245, 0.8);
}
</style>