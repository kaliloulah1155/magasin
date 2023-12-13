<template>
    <div class="dashboard ma-4">
        <h1 class="text-subtitle-1 text-grey">Employés</h1>
        <v-container class="my-5"></v-container>
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
        inputRules: [
            v => (v && v.length >= 3) || "La longueur minimale est de 3 caractères"
        ],
        inputCdRules: [
            v => (v && v.length >= 2) || "La longueur minimale est de 2 caractères"
        ],
        parents: [
            { libelle: 'Veuillez selectionner' },
            { libelle: 'Florida' },
            { libelle: 'Georgia' },
            { libelle: 'Nebraska' },
            { libelle: 'California' },
            { libelle: 'New York' },
        ],
        employes: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            libelle: '',
            parent: '',
            code: '',
            position: 0,
            statut: "Activée",
        },
        defaultItem: {
            id: 0,
            libelle: '',
            parent: '',
            code: '',
            position: 0,
            statut: "Activée",
        }
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

            ]
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
            this.categories.splice(this.editedIndex, 1)
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
                Object.assign(this.categories[this.editedIndex], this.editedItem)
            } else {
                this.categories.push(this.editedItem)
            }
            this.close()
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