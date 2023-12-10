<template>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css"
    />
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
                    :sort-by="[{ key: 'libelle', order: 'asc' }]"
                        items-per-page="5"
                        server-items-length="5"
                    >
                    <template v-slot:item.actions="{item}">
                        <v-icon
                        size="small"
                        class="me-2"
                        @click="editItem(item)"
                        >
                           edit_note
                        </v-icon>
                        <v-icon
                        size="small"
                        @click="deleteItem(item)"
                        >
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
            { title: "Calories", key: "calories" },
            { title: "Fat (g)", key: "fat" },
            { title: "Carbs (g)", key: "carbs" },
            { title: "Protein (g)", key: "protein" },
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
                    libelle: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                },
                {
                    libelle: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                },
                {
                    libelle: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                },
                {
                    libelle: 'Cupcake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                },
                {
                    libelle: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                },
                {
                    libelle: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                },
                {
                    libelle: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                },
                {
                    libelle: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                },
                {
                    libelle: 'Donut',
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                },
                {
                    libelle: 'KitKat',
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                },
                {
                    libelle: 'KitKat',
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                },
                 {
                    libelle: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                },
                 {
                    libelle: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                },
            ]
        },
        editItem(item){
            console.log(item)
        },
        deleteItem(item){
            console.log(item)
        }
    }
}
</script>
<style scoped>
.v-pagination{
    background: rgba(12, 185, 245, 0.8);
  }
</style>